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
    visualType?: "image" | "3d";
    visualUrl?: string; // e.g. Unsplash URL
    visualComponent?: string; // unique ID for 3D component (e.g. "ScatterPlot3D")
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
          "Artificial Intelligence is the science of making machines do things that would require intelligence if done by humans. But it's crucial to understand we are not creating consciousness — we are creating complex math equations that learn.\n\nAI isn't magic. It's **Data**, **Math**, and **Compute** combining to mimic human logic.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", // Abstract glowing data
      },
      {
        title: "Rule-Based vs. AI Systems",
        content:
          "In traditional code, you give the computer the exact steps. \n\n**Analogy**: Making a cake.\nIf you bake it via hard-coding, you give precise instructions: *Take 2 eggs, whisk for 3 mins, bake at 350F*.\n\nIf you use AI (Machine Learning), you show the computer 1,000 pictures of good cakes and bad cakes, and the ingredients used. The AI eventually *figures out* the recipe on its own through trial and error.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop", // Code vs abstract math
      },
      {
        title: "Types of AI",
        content:
          "**Narrow AI (ANI)**: Highly specialized. It plays chess, recommends movies, or generates text. All AI today, including ChatGPT, is Narrow AI.\n\n**General AI (AGI)**: A hypothetical machine that can understand and learn *any* intellectual task a human can. An AGI could learn to drive a car, then instantly learn how to read medical scans with the same brain.\n\n**Super AI (ASI)**: An intellect vastly smarter than the best human brains in practically every field. This is purely theoretical.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1675271591211-126ad94e4958?q=80&w=1000&auto=format&fit=crop", // Abstract futuristic
      },
      {
        title: "How It Works Under the Hood",
        content:
          "For AI systems to understand real-world concepts like 'happy', they convert everything into **Numbers**. Specifically, arrays of numbers called vectors.\n\nFor example, 'Dog' might become `[0.9, 0.4, 0.1]` in the AI's brain. 'Wolf' might be `[0.9, 0.5, 0.2]`. By turning concepts into math, the computer can *calculate* that a dog is mathematically similar to a wolf.\n\nIt's all about geometry in high-dimensional space.",
        visualType: "3d",
        visualComponent: "WordEmbeddings3D", // Reusing this 3D component to show points in space
      },
    ],
    quiz: [
      {
        question: "Which of these accurately describes all AI systems today?",
        options: ["Super AI", "General AI", "Narrow AI", "Conscious AI"],
        correctIndex: 2,
      },
      {
        question: "How does AI fundamentally understand real-world concepts like words or images?",
        options: [
          "By understanding emotion",
          "By converting them into numbers (vectors)",
          "By reading dictionaries",
          "Through hard-coded boolean logic",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "what-is-ml",
    title: "What is Machine Learning?",
    description:
      "Learn how systems 'learn' from data without explicit instructions, using 3D spatial separation.",
    icon: BarChart3,
    color: "#a78bfa",
    duration: "10 min",
    difficulty: "Beginner",
    order: 2,
    sections: [
      {
        title: "The Paradigm Shift",
        content:
          "Machine Learning (ML) is the engine behind modern AI. Instead of writing infinite IF/ELSE statements, we feed data to an algorithm and let it find the rules.\n\n**Example**: How do you detect spam?\n\nIf you use traditional programming, you'll write rules: *If email contains \"FREE MONEY\", flag as spam.* \n\nBut spammers just change it to \"FR33 M0N3Y\". You can't write enough rules. ML solves this by looking at thousands of spam emails and mapping the mathematical patterns that distinguish them from regular emails.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop", // Data dashboard
      },
      {
        title: "How Models Classify Data",
        content:
          "Let's look at **Classification**. Imagine we want to predict if a patient has a disease based on two metrics: Blood Pressure (X-axis) and Age (Y-axis).\n\nIf we map hundreds of patients onto a graph, we might see clusters — healthy patients clump together, and sick patients clump together.\n\nA Machine Learning model's job is simply drawing a distinct boundary (a line or a plane) between those groups. It 'learns' by repeatedly shifting this line until the separation is perfect.",
        visualType: "3d",
        visualComponent: "ScatterPlot3D", // Bespoke 3D scene: points and a dividing plane
      },
      {
        title: "Three Types of Learning",
        content:
          "**Supervised Learning**: The AI has the answers during training. You give it photos labeled 'Cat' and 'Dog'. It learns the patterns separating them. (Like having a teacher).\n\n**Unsupervised Learning**: The AI gets raw data with NO labels. It's asked to just find hidden structures. Example: Grouping customers by purchasing behavior.\n\n**Reinforcement Learning**: The AI is dropped into an environment. It makes random choices and gets 'points' for good outcomes and 'penalties' for bad ones. This is how AIs learn to beat humans at chess or Mario.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop", // Robot playing games or abstract 
      },
      {
        title: "Generalization",
        content:
          "The ultimate goal of ML is NOT to memorize the training data. The goal is **Generalization** — performing accurately on data it has *never seen before*.\n\nIf you train an AI on 1,000 cat images, and it can only recognize those exact 1,000 images, it's useless. It has 'overfitted'. But if you show it a cat it has never seen, from a strange angle, and it still says 'Cat' — that means the model has successfully generalized the core concept of 'cat-ness'.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1506744626753-1fa76046e5dc?q=80&w=1000&auto=format&fit=crop",
      },
    ],
    quiz: [
      {
        question: "What is it called when a model just memorizes data but fails on new, unseen examples?",
        options: ["Generalization", "Supervised Learning", "Overfitting", "Reinforcement"],
        correctIndex: 2,
      },
      {
        question: "Training an AI to play Super Mario by giving it points for finishing a level is an example of:",
        options: ["Supervised Learning", "Reinforcement Learning", "Unsupervised Learning", "Hard-coding"],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "neural-networks",
    title: "Neural Networks",
    description:
      "Dive inside the nodes and edges that make up deep learning systems.",
    icon: Brain,
    color: "#06b6d4",
    duration: "12 min",
    difficulty: "Intermediate",
    order: 3,
    sections: [
      {
        title: "The Architecture of a Brain",
        content:
          "Neural networks are inspired by biological brains, made up of layers of 'neurons'. But these artificial neurons are much simpler: they are mathematical funnels.\n\n**Input Layer**: Sensors picking up data (pixels of an image, words of a sentence).\n\n**Hidden Layers**: The intermediate steps where features are extracted. Early layers might detect simple lines and edges. Deeper layers combine those edges into shapes, and eventually into complex objects like faces.\n\n**Output Layer**: The final decision (e.g. '80% chance this is a Stop Sign').",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1620825937374-87fc7d6daf02?q=80&w=1000&auto=format&fit=crop", 
      },
      {
        title: "Anatomy of a Single Neuron",
        content:
          "Let's zoom into a single neuron. What happens inside?\n\n1. It receives inputs from several previous neurons.\n2. Each connection has a **Weight** — essentially saying 'how important is this specific signal?'\n3. It multiplies the inputs by the weights, and adds them all up.\n4. It passes that sum through an **Activation Function** — a mathematical gatekeeper that decides 'should I fire and send a signal forward, or stay quiet?'",
        visualType: "3d",
        visualComponent: "SingleNeuron3D", // 3D visualization showing inputs coming in, summing, and firing out
      },
      {
        title: "Backpropagation",
        content:
          "How does the network actually 'learn'? It uses an algorithm called Backpropagation.\n\nImagine the network makes a guess: it looks at a picture of a Stop Sign and says 'Speed Limit'. \nThis is wrong. We calculate the Error.\n\nThe math then flows *backwards* through the network. It asks each neuron: 'How much were you responsible for this error?' The neurons adjust their weights slightly so next time, they won't make the same mistake. Do this millions of times, and the network becomes highly accurate.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Power of Depth",
        content:
          "Why do we call it 'Deep' Learning? Because modern networks have hundreds of hidden layers.\n\nA shallow network can only learn simple things (like straight lines). But by stacking layers deeply, the network can learn hierarchical complexities. Lines become corners, corners become eyes, eyes become faces. Depth is the secret ingredient that allows AI to generate photorealistic images or understand complex poetry.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1509228627152-cbcebea026cb?q=80&w=1000&auto=format&fit=crop",
      },
    ],
    quiz: [
      {
        question: "What does the 'Weight' on a neuron's connection represent?",
        options: [
          "The speed of the computer",
          "The raw data pixel",
          "How important that specific incoming signal is",
          "The final output decision",
        ],
        correctIndex: 2,
      },
      {
        question: "How do neural networks correct their mistakes during training?",
        options: [
          "Through a process called Backpropagation",
          "The programmer manually changes the rules",
          "By adding more neurons randomly",
          "They cannot correct mistakes",
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    description:
      "Visualize how models minimize errors by rolling down a mathematical hillside.",
    icon: TrendingDown,
    color: "#22d3ee",
    duration: "10 min",
    difficulty: "Intermediate",
    order: 4,
    sections: [
      {
        title: "The Landscape of Error",
        content:
          "When an AI starts training, it guesses randomly and makes terrible predictions. Its 'Error' or 'Cost' is extremely high.\n\nImagine this Error as a literal 3D mountain landscape. Getting the right answer means reaching the lowest valley (zero error). But the AI is blindfolded. It can only feel the slope of the ground right under its feet.",
        visualType: "3d",
        visualComponent: "GradientSurface3D", // 3D topographical map with a ball
      },
      {
        title: "Taking the Step",
        content:
          "The algorithm to get down the mountain is called **Gradient Descent**.\n\n1. Use calculus to find the slope (the gradient) at the current position.\n2. Point your foot downhill.\n3. Take a step down.\n4. Repeat until the ground is flat (you are in the valley minimum).",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000&auto=format&fit=crop", // Mountains
      },
      {
        title: "The Learning Rate",
        content:
          "The size of the step you take is called the **Learning Rate**. This is crucial.\n\nIf you take tiny baby steps (small learning rate), you'll definitely reach the bottom, but it will take thousands of years. You waste computing power.\n\nIf you take giant leaps (huge learning rate), you'll completely miss the valley out of momentum, jumping to the opposite mountain side and bouncing around out of control.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1616492318469-87a32bd05bc5?q=80&w=1000&auto=format&fit=crop", // Abstract jumps
      },
      {
        title: "Local vs Global Minima",
        content:
          "Real-world AI landscapes aren't smooth bowls. They are jagged, with many different valleys.\n\nA major problem in training is getting stuck in a 'Local Minimum' — a small dip high up on the mountain. The AI thinks it reached the bottom because it's flat, but there's a much lower valley over the next ridge (the 'Global Minimum'). Modern optimizers (like Adam) add 'momentum' to help the AI roll over small hills and find the true bottom.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", // Jagged peaks
      },
    ],
    quiz: [
      {
        question: "What does the 'Landscape' represent in Gradient Descent?",
        options: [
          "The amount of data available",
          "The speed of the network",
          "The model's Prediction Error (Cost)",
          "The number of layers",
        ],
        correctIndex: 2,
      },
      {
        question: "Why is a learning rate that is too high dangerous?",
        options: [
          "It makes training too slow",
          "It overshoots the minimum and fails to converge",
          "It deletes the data",
          "It generates images instead of text",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "how-llms-work",
    title: "How LLMs Work",
    description:
      "Understand the mechanics of Attention and Embeddings in modern Generative AI.",
    icon: Sparkles,
    color: "#f472b6",
    duration: "15 min",
    difficulty: "Advanced",
    order: 5,
    sections: [
      {
        title: "Next Token Prediction",
        content:
          "A Large Language Model (LLM) like ChatGPT has one fundamental job: look at a string of text, and predict the single highest-probability next word (token).\n\nIf you feed it: 'The cat in the...'\nIt calculates the probability of exactly what comes next. 'Hat' gets 85%. 'Box' gets 10%.\n\nIt works so well because it has read nearly the entire internet to learn these probabilities.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1000&auto=format&fit=crop", // Book/Text
      },
      {
        title: "Turning Words into Numbers (Embeddings)",
        content:
          "Computers can't read 'Apple' or 'Dog'. We must convert words into high-dimensional vectors, called Embeddings.\n\nImagine a 3D graph. One axis is 'Animalness', another is 'Cuteness', another is 'Danger'.\n'Dog' might live at coordinates [10, 8, 2]. 'Wolf' lives right next to it at [10, 4, 8]. \n\nBy converting vocabulary into a vast mathematical space, the model inherently understands similarities, analogies, and nuances just by checking the distance between two words.",
        visualType: "3d",
        visualComponent: "WordEmbeddings3D", // 3D point cloud of words
      },
      {
        title: "The Transformer & Self-Attention",
        content:
          "The breakthrough that created ChatGPT is the Transformer architecture (2017) and its core mechanism: **Self-Attention**.\n\nConsider the sentence: *'The bank of the river'* vs *'The bank was robbed'.*\nThe word 'bank' means entirely different things based on context. \n\nSelf-attention allows every word in a sequence to 'look' at every other word to understand context. 'Bank' figures out its meaning by looking deeply at 'river' or 'robbed'.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", // Glowing network lines
      },
      {
        title: "Generating the Output",
        content:
          "When you ask a question, the LLM processes your prompt through dozens of transformer layers.\nEach layer applies attention, refining the context of the words.\n\nAt the end, it outputs the probability for ALL 50,000 words in its vocabulary. It selects the most likely next word, appends it to your prompt, and starts the entire process over again. It hallucinates its answer one word at a time, blindingly fast.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop", // Matrix/Data speed
      },
    ],
    quiz: [
      {
        question: "What is an Embedding?",
        options: [
          "A type of computer chip",
          "A mathematical representation of a word translated into a vector space",
          "The prompt you send to an AI",
          "The mechanism that deletes data",
        ],
        correctIndex: 1,
      },
      {
        question: "How does the 'Self-Attention' mechanism help interpret language?",
        options: [
          "By ignoring words it doesn't know",
          "By searching Google for answers",
          "By allowing words to look at surrounding words in a sentence to figure out context",
          "By translating everything to French",
        ],
        correctIndex: 2,
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
