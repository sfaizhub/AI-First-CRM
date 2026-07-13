import os
from dotenv import load_dotenv

load_dotenv()

from typing import TypedDict

from langchain_groq import ChatGroq
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
    ToolMessage,
)

from langgraph.graph import StateGraph, END


from app.tools.hcp_tools import (
    get_hcp_profile,
    get_interaction_history,
    suggest_next_best_action,
)

from app.tools.interaction_tools import (
    log_interaction,
    edit_interaction,
)



class AgentState(TypedDict):
    messages: list



# Tools
tools = [
    get_hcp_profile,
    get_interaction_history,
    suggest_next_best_action,
    log_interaction,
    edit_interaction,
]


# Check API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY missing. Add it in backend/.env"
    )


# Groq Model
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
)


# Debug tool names
for tool in tools:
    print("REGISTERED TOOL:", tool.name)



# Bind tools
llm_with_tools = llm.bind_tools(tools)



# Chatbot node
def chatbot(state: AgentState):

    response = llm_with_tools.invoke(
        state["messages"]
    )

    return {
        "messages": [
            response
        ]
    }



# Tool execution node
def tool_node(state: AgentState):

    last_message = state["messages"][-1]

    tool_messages = []


    tool_map = {
        tool.name: tool
        for tool in tools
    }


    for tool_call in last_message.tool_calls:

        tool = tool_map[tool_call["name"]]


        result = tool.invoke(
            tool_call["args"]
        )


        tool_messages.append(
            ToolMessage(
                content=result,
                tool_call_id=tool_call["id"]
            )
        )


    return {
        "messages": tool_messages
    }




# Decide next step
def should_continue(state: AgentState):

    last_message = state["messages"][-1]


    if last_message.tool_calls:
        return "tools"


    return END




# LangGraph workflow

workflow = StateGraph(AgentState)


workflow.add_node(
    "chatbot",
    chatbot
)


workflow.add_node(
    "tools",
    tool_node
)


workflow.set_entry_point(
    "chatbot"
)


workflow.add_conditional_edges(
    "chatbot",
    should_continue
)


workflow.add_edge(
    "tools",
    "chatbot"
)


agent = workflow.compile()




# FastAPI function

def run_agent(message: str):

    result = agent.invoke(
        {
            "messages": [
                SystemMessage(
                    content="""
You are an AI-first CRM assistant.

Use tools whenever required.

Available tools:
1. get_hcp_profile
2. get_interaction_history
3. suggest_next_best_action
4. log_interaction
5. edit_interaction

Always call the correct tool for CRM requests.
"""
                ),
                HumanMessage(
                    content=message
                )
            ]
        }
    )


    final_message = result["messages"][-1]


    return final_message.content