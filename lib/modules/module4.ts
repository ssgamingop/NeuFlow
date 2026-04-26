import { Eye, Clock, MessageSquare, Sparkles } from "lucide-react";
import { LessonData } from "../lesson.types";

export const module4: LessonData[] = [
  {
    slug: "computer-vision",
    title: "How AI Sees (CNNs)",
    description:
      "Understand Convolutional Neural Networks, the technology that powers facial recognition and self-driving cars.",
    icon: Eye,
    color: "#4ade80",
    duration: "13 min",
    difficulty: "Advanced",
    order: 13,
    module: 4,
    sections: [
      {
        title: "Pixels to Math",
        content:
          "When you look at a photograph, you see your friend. When a computer looks at it, it sees a massive grid of numbers. An 800x600 image has 480,000 pixels. If it's in color (Red, Green, Blue), that's over 1.4 million numbers!\n\nStandard Neural Networks fail violently here because 1.4 million inputs would require trillions of connections, instantly melting your computer. We needed a better way to extract visual information.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Magic of Convolutions",
        content:
          "A **Convolutional Neural Network (CNN)** solves this by scanning the image with a 'filter' (a small 3x3 grid).\n\nInstead of looking at the whole image at once, it slides a magnifying glass across the pixels looking for extremely simple patterns. One filter might look for straight vertical lines. Another filter looks for dark red spots.\n\nAs you stack layers, the filters look at the results of the previous filters. So lines become shapes, and shapes become eyes, ears, and noses.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Max Pooling",
        content:
          "After scanning an image with filters, we end up with a 'Feature Map' that highlights where lines or shapes exist. But this map is still huge.\n\nWe use **Max Pooling** to compress it. A 2x2 window slides over the map, and we just keep the highest number in that window. This physically shrinks the image while keeping the most important feature data intact. It also makes the AI 'translation invariant' (it can recognize a cat even if the cat is shifted to the left).",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "How do Convolutional Neural Networks prevent the computer from crashing?",
        options: [
          "They delete half the image",
          "They use tiny sliding filters to extract features instead of connecting every pixel to every neuron",
          "They convert images to sound",
          "They run on quantum computers",
        ],
        correctIndex: 1,
      },
      {
        question: "What is the purpose of Max Pooling?",
        options: [
          "To increase the image resolution",
          "To add color to the image",
          "To downsample/compress the feature maps while retaining important information",
          "To delete the background"
        ],
        correctIndex: 2,
      }
    ],
  },
  {
    slug: "rnns-and-lstms",
    title: "Sequences & Memory",
    description:
      "Time matters. Discover how RNNs and LSTMs allow networks to process sequential data like audio and stock prices.",
    icon: Clock,
    color: "#6366f1",
    duration: "14 min",
    difficulty: "Advanced",
    order: 14,
    module: 4,
    sections: [
      {
        title: "The Problem with Time",
        content:
          "A standard neural network has amnesia. It processes an input, spits out an output, and immediately forgets everything. \n\nThis is fine for single images, but what about a sentence? Or a video? Or stock market prices over a month? For these, the order of the data matters. The network needs **Memory**.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Recurrent Neural Networks (RNNs)",
        content:
          "An **RNN** solves this by creating a loop. When it processes word #1, it generates a 'hidden state' (a memory vector). \n\nWhen it processes word #2, it looks at the new word AND the memory from word #1. This allows context to flow through time.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Long Short-Term Memory (LSTM)",
        content:
          "RNNs have a fatal flaw: short-term memory loss (caused by the vanishing gradient). If a sentence is 50 words long, the RNN completely forgets the first word by the time it reaches the end.\n\n**LSTMs** fixed this by introducing a complex 'Conveyor Belt' with gates. These gates use math to explicitly decide: \n1. What to forget\n2. What to remember\n3. What to output\n\nThis allows networks to remember context over very long sequences.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Why do standard neural networks fail at processing text or video?",
        options: [
          "They cannot read English",
          "They have no memory of the previous inputs (order matters in sequences)",
          "They are too slow",
          "They are only for images"
        ],
        correctIndex: 1,
      },
      {
        question: "How does an LSTM solve the short-term memory problem of an RNN?",
        options: [
          "By using more GPUs",
          "By increasing the learning rate",
          "By using a conveyor belt state with gates to explicitly choose what to forget and remember",
          "By converting text to images"
        ],
        correctIndex: 2,
      }
    ],
  },
  {
    slug: "nlp",
    title: "How AI Reads (NLP)",
    description:
      "Discover Natural Language Processing and how machines understand the semantic meaning of human text.",
    icon: MessageSquare,
    color: "#f59e0b",
    duration: "11 min",
    difficulty: "Advanced",
    order: 15,
    module: 4,
    sections: [
      {
        title: "The Intelligence of Language",
        content:
          "Natural Language Processing (NLP) is the branch of AI focused on making computers understand human language. Language is notoriously messy, filled with sarcasm, double meanings, and slang.\n\nBefore modern AI, engineers tried to map English grammar into strict rules for the computer. It was a disaster. Consider the sentence: 'Time flies like an arrow, fruit flies like a banana.' A rule-based system completely physically breaks trying to parse the two different meanings of 'flies'.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Tokenization & Embeddings",
        content:
          "Modern NLP systems rely on statistics. First, they chop a sentence into smaller pieces called **Tokens**. 'Unbelievable' might be tokenized into 'Un', 'believ', 'able'.\n\nThen, we cast those tokens into massive high-dimensional math structures called **Embeddings** where words with similar semantic meanings are placed physically close together in the 3D space.",
        visualType: "3d",
        visualComponent: "WordEmbeddings3D",
      },
    ],
    quiz: [
      {
        question: "What is tokenization?",
        options: [
          "Paying a subscription fee",
          "Chopping raw text into smaller processable pieces",
          "Creating a cryptocurrency",
          "Generating an image",
        ],
        correctIndex: 1,
      },
      {
        question: "What is a Word Embedding?",
        options: [
          "A font style",
          "A high-dimensional vector where semantically similar words are physically close together",
          "A translation from English to Spanish",
          "A grammar checking rule"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "how-llms-work",
    title: "The Modern Era of LLMs",
    description:
      "Understand the breakthrough mechanics of Transformers, Self-Attention, and ChatGPT.",
    icon: Sparkles,
    color: "#f472b6",
    duration: "15 min",
    difficulty: "Advanced",
    order: 16,
    module: 4,
    sections: [
      {
        title: "Next Token Prediction",
        content:
          "A Large Language Model (LLM) like ChatGPT has one fundamental job: look at a string of text, and predict the single highest-probability next word (token).\n\nIf you feed it: 'The cat in the...'\nIt calculates the probability of exactly what comes next. 'Hat' gets 85%. 'Box' gets 10%. It then feeds 'Hat' back into itself and predicts the next word. Over and over.\n\nIt works so well because it has read nearly the entire internet to learn these probabilities.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Transformer & Self-Attention",
        content:
          "The breakthrough that created ChatGPT is the Transformer architecture (2017) and its core mechanism: **Self-Attention**.\n\nConsider the sentence: *'The bank of the river'* vs *'The bank was robbed'.*\nThe word 'bank' means entirely different things based on context. \n\nSelf-attention allows every word in a sequence to 'look' at every other word to understand context simultaneously, without needing to process them in order like an RNN. 'Bank' figures out its true meaning by casting mathematical attention to 'river' or 'robbed'.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "RLHF: Why ChatGPT is Nice",
        content:
          "If you just train an LLM on the internet, it becomes a toxic autocomplete engine. It will mimic internet trolls.\n\nTo fix this, OpenAI used **Reinforcement Learning from Human Feedback (RLHF)**. They hired thousands of humans to rate the AI's responses. The AI used these ratings to learn a 'Reward Model' that forces its outputs to be Helpful, Honest, and Harmless.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1675271591211-126ad94e4958?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "What is an LLM fundamentally trying to do?",
        options: [
          "Understand human psychology",
          "Search Google for facts",
          "Calculate the mathematical probability of the next token/word",
          "Generate images",
        ],
        correctIndex: 2,
      },
      {
        question: "What mechanism allows the Transformer to understand context better than an RNN?",
        options: [
          "Self-Attention",
          "Max Pooling",
          "Backpropagation",
          "Decision Trees"
        ],
        correctIndex: 0,
      },
      {
        question: "What technique is used to make base LLMs polite and helpful chat assistants?",
        options: [
          "Deleting toxic words from the dictionary",
          "Reinforcement Learning from Human Feedback (RLHF)",
          "Using a smaller dataset",
          "Hardcoding rules for niceness"
        ],
        correctIndex: 1,
      }
    ],
  }
];
