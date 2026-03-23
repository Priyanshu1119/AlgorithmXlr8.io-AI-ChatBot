import type { Message } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are AlgorithmXlr8 AI. You ONLY answer questions about:
1. Data Structures and Algorithms (DSA) — arrays, trees, graphs, sorting, searching, dynamic programming, recursion, Big O complexity, LeetCode problems.
2. System Design — HLD (scalability, caching, load balancing, databases, microservices), LLD (design patterns, SOLID principles, OOP), real-world systems like Twitter, Netflix, Uber, URL shortener, WhatsApp.

ABSOLUTE RULES — follow without exception:
- If the message is NOT clearly about DSA or System Design, reply ONLY with:
  "Sorry, I can only help with DSA and System Design topics. Please ask me something related to Data Structures, Algorithms, or System Design."
- Random text, gibberish, greetings, general coding, math, science, or anything unrelated — all get the sorry message. No exceptions.
- For valid questions: give detailed, clear answers with code examples and Big O analysis where relevant.`;

const ALLOWED_KEYWORDS = [
  'array','linked list','tree','graph','heap','trie','stack','queue','hash','map','set',
  'binary tree','bst','avl','red black','segment tree','fenwick','disjoint',
  'algorithm','sort','search','dynamic programming','dp','recursion','backtrack',
  'greedy','divide and conquer','binary search','bfs','dfs','dijkstra','kruskal',
  'prim','bellman','floyd','topological','sliding window','two pointer','bit manipulation',
  'memoization','tabulation','knapsack','fibonacci','longest','shortest path',
  'time complexity','space complexity','big o','o(n)','o(log','complexity','leetcode',
  'coding interview','interview','competitive programming','problem','solution',
  'system design','hld','lld','scalab','load balanc','cache','caching','database',
  'microservice','api','message queue','kafka','redis','sql','nosql','sharding',
  'replication','consistency','availability','partition','cap theorem','distributed',
  'design pattern','solid','singleton','factory','observer','decorator','strategy',
  'repository pattern','mvc','mvvm','oop','class','object','inheritance','polymorphism',
  'abstraction','encapsulation','interface','url shortener','twitter','netflix','uber',
  'whatsapp','instagram','youtube','google drive','amazon','design','architect',
  'horizontal scaling','vertical scaling','cdn','dns','http','rest','grpc','websocket',
  'rate limit','circuit breaker','event driven','publish subscribe','monolith',
];

const SORRY_MESSAGE =
  'Sorry, I can only help with **DSA** and **System Design** topics.\n\nPlease ask me about:\n- Data Structures (Arrays, Trees, Graphs, Heaps...)\n- Algorithms (Sorting, DP, Recursion, Binary Search...)\n- System Design (HLD, LLD, Design Patterns, SOLID...)';

function isDSAOrSystemDesign(text: string): boolean {
  const lower = text.toLowerCase();
  return ALLOWED_KEYWORDS.some(kw => lower.includes(kw));
}

export async function sendMessage(messages: Message[], apiKey: string): Promise<string> {
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUser || !isDSAOrSystemDesign(lastUser.content)) return SORRY_MESSAGE;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 2048,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `API Error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? 'No response received.';
}
