from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph import START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

from app.database import settings
from app.tools.hcp_tools import (
    get_hcp_profile,
    get_interaction_history,
    suggest_next_best_action,
)
from app.tools.interaction_tools import (
    log_interaction,
    edit_interaction,
    generate_ai_summary,
)
from app.tools.followup_tools import generate_followup


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


tools = [
    log_interaction,
    edit_interaction,
    generate_ai_summary,
    get_hcp_profile,
    get_interaction_history,
    suggest_next_best_action,
    generate_followup,
]


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=settings.groq_api_key,
)

llm_with_tools = llm.bind_tools(tools)

system_message = SystemMessage(
    content="""
You are an AI-first CRM Assistant for Healthcare Representatives.

Always use tools whenever possible.

Available Tools:
1. log_interaction
2. edit_interaction
3. generate_ai_summary
4. get_hcp_profile
5. get_interaction_history
6. suggest_next_best_action
7. generate_followup

Important Rules:

- Never invent IDs.
- The tools suggest_next_best_action, generate_followup and get_interaction_history require an INTEGER hcp_id.
- If the user mentions a doctor's name (for example "Dr. Amit Sharma") and not an ID, FIRST use get_hcp_profile to obtain the HCP information.
- Extract the numeric id from the tool response and use ONLY that integer in subsequent tool calls.
- Never pass text like "Dr. Amit Sharma's ID" as hcp_id.
- If you cannot determine the numeric ID, ask the user for the HCP ID.

Use:
- log_interaction → save interaction
- edit_interaction → edit interaction
- generate_ai_summary → summarize notes
- get_hcp_profile → doctor details
- get_interaction_history → previous meetings
- suggest_next_best_action → recommendation
- generate_followup → follow-up plan
"""
)


def assistant_node(state: AgentState):
    response = llm_with_tools.invoke(
        [system_message, *state["messages"]]
    )

    return {
        "messages": [response]
    }


builder = StateGraph(AgentState)

builder.add_node("assistant", assistant_node)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "assistant")
builder.add_conditional_edges(
    "assistant",
    tools_condition,
)
builder.add_edge("tools", "assistant")

hcp_agent_graph = builder.compile()


def run_hcp_agent(user_message: str):

    result = hcp_agent_graph.invoke(
        {
            "messages": [
                HumanMessage(content=user_message)
            ]
        }
    )

    final_message = result["messages"][-1]

    tool_calls = []

    for message in result["messages"]:
        if hasattr(message, "tool_calls"):
            for tool in message.tool_calls:
                tool_calls.append(tool["name"])

    return {
        "reply": str(final_message.content),
        "tool_calls": tool_calls,
    }