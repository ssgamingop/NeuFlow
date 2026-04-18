import {
  Bot,
  BarChart3,
  Brain,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export interface LessonData {
  slug: string;
  title: string;
  description: string;
  icon: typeof Bot;
  color: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  order: number;
  sections: {
    title: string;
    content: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export const lessons: LessonData[] = [
  {
    slug: "what-is-ai",
    title: "What is AI?",
    description:
      "Discover what artificial intelligence really means, from rule-based systems to modern learning machines.",
    icon: Bot,
    color: "#8b5cf6",
    duration: "8 min",
    difficulty: "Beginner",
    order: 1,
    sections: [
      {
        title: "The Big Picture",
        content:
          "Artificial Intelligence is the science of making machines do things that would require intelligence if done by humans. But it's not about creating consciousness — it's about building systems that can learn patterns, make decisions, and solve problems.\n\nAI isn't magic. It's math, data, and clever algorithms working together.",
      },
      {
        title: "Types of AI",
        content:
          "**Narrow AI (ANI):** Designed for one specific task — like image recognition, language translation, or playing chess. Every AI you interact with today is narrow AI.\n\n**General AI (AGI):** A hypothetical system that could understand and learn any intellectual task a human can. This doesn't exist yet.\n\n**Super AI (ASI):** AI that surpasses human intelligence across every domain. This is purely theoretical.",
      },
      {
        title: "AI in Daily Life",
        content:
          "You're already surrounded by AI:\n\n• **Autocomplete** in your search bar predicts what you'll type\n• **Spam filters** learn which emails to block\n• **Netflix recommendations** analyze your watching patterns\n• **Face unlock** on your phone uses computer vision\n• **Voice assistants** (Siri, Alexa) understand natural language\n\nEvery one of these uses pattern recognition — the core of modern AI.",
      },
      {
        title: "Key Takeaway",
        content:
          "AI is not about making robots think like humans. It's about making machines find patterns in data and use those patterns to make predictions or decisions. The smarter the data, the smarter the AI.",
      },
    ],
    quiz: [
      {
        question: "What type of AI are all current AI systems?",
        options: ["Super AI", "General AI", "Narrow AI", "Conscious AI"],
        correctIndex: 2,
      },
      {
        question: "What is the core mechanism behind modern AI?",
        options: [
          "Rule-based logic",
          "Pattern recognition",
          "Consciousness",
          "Quantum computing",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "what-is-ml",
    title: "What is Machine Learning?",
    description:
      "Learn how machines learn from data without being explicitly programmed for every scenario.",
    icon: BarChart3,
    color: "#a78bfa",
    duration: "10 min",
    difficulty: "Beginner",
    order: 2,
    sections: [
      {
        title: "Learning from Data",
        content:
          "Machine Learning is a subset of AI where systems learn patterns from data instead of being explicitly programmed with rules.\n\nTraditional programming: You write rules → Computer follows rules\nMachine Learning: You provide data → Computer discovers rules",
      },
      {
        title: "Three Types of Learning",
        content:
          "**Supervised Learning:** You give the model labeled examples. \"This image is a cat, this is a dog.\" It learns to classify new images.\n\n**Unsupervised Learning:** You give unlabeled data and the model finds hidden patterns — like grouping customers by behavior.\n\n**Reinforcement Learning:** The model learns by trial and error, receiving rewards for good actions — like training an AI to play games.",
      },
      {
        title: "The Training Process",
        content:
          "1. **Collect data** — Gather examples relevant to your problem\n2. **Choose a model** — Select an algorithm architecture\n3. **Train** — Feed data through the model, adjusting parameters\n4. **Evaluate** — Test on data the model hasn't seen\n5. **Deploy** — Use the trained model on real-world data\n\nThe model isn't memorizing — it's generalizing. It discovers the underlying pattern so it can handle new, unseen inputs.",
      },
      {
        title: "Key Takeaway",
        content:
          "Machine Learning shifts the paradigm from \"tell the computer what to do\" to \"show the computer examples and let it figure it out.\" The quality and quantity of your data directly determines how good your model will be.",
      },
    ],
    quiz: [
      {
        question:
          "In supervised learning, what kind of data is provided?",
        options: [
          "Unlabeled data",
          "Labeled examples",
          "Random noise",
          "No data needed",
        ],
        correctIndex: 1,
      },
      {
        question: "What determines the quality of a ML model?",
        options: [
          "The programming language used",
          "The speed of the computer",
          "The quality and quantity of data",
          "The color of the UI",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    slug: "neural-networks",
    title: "Neural Networks",
    description:
      "Understand how layers of connected neurons transform inputs into predictions.",
    icon: Brain,
    color: "#06b6d4",
    duration: "12 min",
    difficulty: "Intermediate",
    order: 3,
    sections: [
      {
        title: "Inspired by Biology",
        content:
          "Neural Networks are computing systems loosely inspired by the brain's structure. They consist of layers of interconnected nodes (neurons) that process information.\n\nBut don't be misled — artificial neurons are nothing like biological ones. They're just mathematical functions that take inputs, apply weights, and produce outputs.",
      },
      {
        title: "Anatomy of a Network",
        content:
          "**Input Layer:** Receives the raw data (pixels, numbers, text)\n\n**Hidden Layers:** Where the magic happens. Each layer extracts increasingly abstract features. Early layers might detect edges; deeper layers detect faces.\n\n**Output Layer:** Produces the final prediction — a class label, a number, or a probability distribution.\n\nEach connection between neurons has a **weight** — a number that determines how much influence one neuron has on another.",
      },
      {
        title: "How It Learns",
        content:
          "1. **Forward Pass:** Data flows through the network, producing a prediction\n2. **Loss Calculation:** Compare prediction to the correct answer — how wrong was it?\n3. **Backpropagation:** Calculate how much each weight contributed to the error\n4. **Weight Update:** Adjust weights to reduce the error\n5. **Repeat:** Do this thousands of times until the model is accurate\n\nThis is called **training** — the network literally adjusts its internal wiring to get better at the task.",
      },
      {
        title: "Key Takeaway",
        content:
          "A neural network is a function that transforms inputs into outputs through layers of weighted connections. It learns by adjusting these weights to minimize prediction errors. Depth (more layers) allows it to learn more complex patterns.",
      },
    ],
    quiz: [
      {
        question: "What happens during backpropagation?",
        options: [
          "Data flows forward through the network",
          "The model is deleted and rebuilt",
          "Error gradients flow backward to update weights",
          "New neurons are added",
        ],
        correctIndex: 2,
      },
      {
        question: "What do deeper layers in a network learn?",
        options: [
          "Simpler patterns",
          "More abstract/complex features",
          "Nothing useful",
          "The same as early layers",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    description:
      "See how models find the optimal solution by following the slope of the error landscape.",
    icon: TrendingDown,
    color: "#22d3ee",
    duration: "10 min",
    difficulty: "Intermediate",
    order: 4,
    sections: [
      {
        title: "The Optimization Problem",
        content:
          "Training a neural network is really an optimization problem: find the set of weights that minimizes the prediction error.\n\nImagine you're blindfolded on a hilly landscape and you need to find the lowest valley. You can only feel the slope beneath your feet. Which way do you step?",
      },
      {
        title: "Following the Slope",
        content:
          "**Gradient Descent** is the algorithm that answers this. At each step:\n\n1. Calculate the **gradient** (slope) of the error with respect to each weight\n2. Take a step in the **opposite direction** of the gradient (downhill)\n3. The size of the step is controlled by the **learning rate**\n\nDo this repeatedly, and you'll eventually reach a minimum — the point of lowest error.",
      },
      {
        title: "Learning Rate: The Critical Hyperparameter",
        content:
          "**Too high:** You overshoot the minimum, bouncing around or diverging entirely. The model never converges.\n\n**Too low:** You inch toward the minimum painfully slowly. Training takes forever and you might get stuck in a local minimum.\n\n**Just right:** You converge efficiently to a good solution.\n\nFinding the right learning rate is one of the most important decisions in training a model.",
      },
      {
        title: "Key Takeaway",
        content:
          "Gradient Descent is how neural networks learn. It's a simple but powerful idea: measure the error, figure out which direction reduces it, take a step, repeat. The learning rate controls how aggressive each step is.",
      },
    ],
    quiz: [
      {
        question: "What happens with a learning rate that is too high?",
        options: [
          "The model converges perfectly",
          "The model overshoots and diverges",
          "Training is too slow",
          "The model gets more accurate",
        ],
        correctIndex: 1,
      },
      {
        question: "The gradient tells you:",
        options: [
          "The exact answer",
          "The direction of steepest increase in error",
          "How many neurons to add",
          "When to stop training",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "how-llms-work",
    title: "How LLMs Work",
    description:
      "Uncover the architecture behind ChatGPT, Claude, and other large language models.",
    icon: Sparkles,
    color: "#f472b6",
    duration: "15 min",
    difficulty: "Advanced",
    order: 5,
    sections: [
      {
        title: "What is a Language Model?",
        content:
          "A Large Language Model (LLM) is a neural network trained to predict the next token in a sequence. That's it — at its core, it's a next-word prediction machine.\n\nBut scale this up with billions of parameters and trillions of training tokens, and something remarkable emerges: the model starts to understand context, logic, and even reasoning.",
      },
      {
        title: "The Transformer Architecture",
        content:
          "LLMs are built on the **Transformer** architecture (introduced in 2017). Key components:\n\n**Tokenization:** Text is split into subword tokens (\"playing\" → \"play\" + \"ing\")\n\n**Embeddings:** Each token becomes a high-dimensional vector capturing its meaning\n\n**Self-Attention:** The model learns which tokens should \"pay attention\" to which other tokens. \"The cat sat on the mat\" — \"sat\" attends strongly to \"cat\" (who sat?) and \"mat\" (where?)\n\n**Feed-Forward Layers:** Process the attention-enriched representations\n\n**Output:** A probability distribution over all possible next tokens",
      },
      {
        title: "Attention is All You Need",
        content:
          "The self-attention mechanism is the breakthrough. For each token, it computes:\n\n**Query:** What am I looking for?\n**Key:** What do I contain?\n**Value:** What information do I provide?\n\nBy comparing queries to keys, the model decides how much each token should influence every other token. This allows it to capture long-range dependencies — understanding that a pronoun on page 2 refers back to a name on page 1.",
      },
      {
        title: "Key Takeaway",
        content:
          "LLMs are massive neural networks that learn language by predicting the next token. The Transformer architecture with self-attention allows them to understand context and relationships across long sequences. They don't \"understand\" like humans — they've learned incredibly sophisticated patterns from enormous amounts of text.",
      },
    ],
    quiz: [
      {
        question: "What is the core task an LLM is trained on?",
        options: [
          "Image recognition",
          "Next token prediction",
          "Voice synthesis",
          "Database queries",
        ],
        correctIndex: 1,
      },
      {
        question: "What does the self-attention mechanism do?",
        options: [
          "Adds more layers to the network",
          "Determines how tokens relate to and influence each other",
          "Compresses the model size",
          "Removes irrelevant tokens",
        ],
        correctIndex: 1,
      },
    ],
  },
];

export function getLessonBySlug(slug: string): LessonData | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getNextLesson(currentSlug: string): LessonData | undefined {
  const current = lessons.find((l) => l.slug === currentSlug);
  if (!current) return undefined;
  return lessons.find((l) => l.order === current.order + 1);
}
