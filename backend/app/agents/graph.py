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

Rules:

- Use log_interaction when user wants to save interaction.
- Use edit_interaction when user wants to modify interaction.
- Use generate_ai_summary to summarize meeting notes.
- Use get_hcp_profile when doctor details are requested.
- Use get_interaction_history for previous meetings.
- Use suggest_next_best_action for sales recommendation.
- Use generate_followup for follow-up planning.
- Never invent IDs.
- Ask for missing information if required.
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