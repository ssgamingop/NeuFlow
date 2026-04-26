import { Wand2, Image, Gamepad2, Scale } from "lucide-react";
import { LessonData } from "../lesson.types";

export const module5: LessonData[] = [
  {
    slug: "gans",
    title: "How AI Creates (GANs)",
    description:
      "Learn about Generative Adversarial Networks: the AI architecture where two models fight each other to generate photorealistic art.",
    icon: Wand2,
    color: "#10b981",
    duration: "12 min",
    difficulty: "Advanced",
    order: 17,
    module: 5,
    sections: [
      {
        title: "The Battle of Networks",
        content:
          "A **GAN** (Generative Adversarial Network) is basically an art forger and a detective locked in a room together.\n\nIt consists of two neural networks:\n1. **The Generator** (the forger) tries to create fake images that look real.\n2. **The Discriminator** (the detective) looks at real images and the fake ones, and tries to spot the fakes.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Feedback Loop",
        content:
          "At first, the Generator puts out pure static noise, and the Discriminator easily catches it. But through backpropagation, the Generator learns *why* it was caught.\n\nIt gets better. It starts generating distinct shapes. Then eyes. Then highly detailed faces. Millions of cycles later, the Generator is creating photorealistic human faces of people who have never existed, so perfect that the Discriminator (and humans) cannot tell they are fake.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
      },
    ],
    quiz: [
      {
        question: "What are the two networks inside a GAN called?",
        options: [
          "The Actor and the Critic",
          "The Teacher and the Student",
          "The Generator and the Discriminator",
          "The Encoder and the Decoder",
        ],
        correctIndex: 2,
      },
      {
        question: "How does the Generator learn to create better images?",
        options: [
          "By stealing images from Google",
          "By getting feedback from the Discriminator on why it failed",
          "By using a larger memory card",
          "By drawing random pixels until it succeeds"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "diffusion-models",
    title: "Diffusion Models",
    description:
      "The tech behind Midjourney and DALL-E. How AI generates stunning art by destroying and repairing images.",
    icon: Image,
    color: "#a855f7",
    duration: "13 min",
    difficulty: "Advanced",
    order: 18,
    module: 5,
    sections: [
      {
        title: "The Forward Process: Destruction",
        content:
          "Diffusion models (like Stable Diffusion and DALL-E) learn to generate art in a very bizarre way.\n\nFirst, during training, we take a crisp, beautiful image of a cat. We systematically add static noise to it, step by step, until it is completely unrecognizable TV static. This is the 'Forward Diffusion' process. It's just math destroying an image.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Reverse Process: Repair",
        content:
          "Next, we train a neural network (usually a U-Net architecture) to reverse the process. \n\nWe show it the slightly noisy image, and ask it to predict what the original image looked like. The network learns to effectively 'denoise' the image. By repeating this process thousands of times, the AI becomes a master at pulling structured images out of pure static.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1620825937374-87fc7d6daf02?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Generating from Scratch",
        content:
          "Once trained, how do we generate new art? We start with a completely random block of static noise. We also pass in a text prompt like 'A cyberpunk city'.\n\nThe AI runs its denoising process in reverse, slowly removing the noise while guiding the shapes to look like a cyberpunk city. After 30 or so steps, a masterpiece emerges from the static.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1675271591211-126ad94e4958?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "What is the primary training mechanism of a Diffusion Model?",
        options: [
          "Having two networks fight each other",
          "Learning to predict the next word",
          "Learning to remove noise from an intentionally corrupted image",
          "Sorting images by color"
        ],
        correctIndex: 2,
      },
      {
        question: "When generating a brand new image, a Diffusion model starts with:",
        options: [
          "A blank white canvas",
          "A random block of static noise",
          "A stick figure sketch",
          "A related Google image"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "reinforcement-learning",
    title: "Reinforcement Learning",
    description:
      "How AI agents learn to play games, walk, and navigate the real world through trial and error.",
    icon: Gamepad2,
    color: "#ef4444",
    duration: "14 min",
    difficulty: "Advanced",
    order: 19,
    module: 5,
    sections: [
      {
        title: "Agents and Environments",
        content:
          "Unlike Supervised Learning (where we give the AI the answers), **Reinforcement Learning (RL)** drops an 'Agent' into an 'Environment' and tells it to figure things out.\n\nImagine an AI dropped into Super Mario. It doesn't know the rules. It just knows what buttons it can press (Actions), what the screen looks like (State), and its Score (Reward).",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Exploration vs Exploitation",
        content:
          "At first, the AI mashes buttons randomly (Exploration). It might accidentally run right and get 100 points for grabbing a coin. It learns 'Running right = Good'.\n\nLater, it has a choice. It can keep doing what it knows works to get points safely (Exploitation), or it can try a crazy new jump over a pit to see if there's a bigger reward hidden there (Exploration). Balancing these two is the hardest part of RL.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Deep Q-Learning",
        content:
          "In modern RL, the Agent uses a Deep Neural Network to look at the screen pixels and output the best action to take. This is how DeepMind created AlphaGo to beat the human world champion at Go, and how OpenAI trained bots to beat pro gamers at Dota 2.\n\nThe AI plays millions of games against itself, constantly updating its neural network to maximize long-term rewards.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "In Reinforcement Learning, the AI learns by:",
        options: [
          "Reading a textbook of rules",
          "Maximizing its 'Reward' score through trial and error in an environment",
          "Minimizing the number of pixels",
          "Watching humans play"
        ],
        correctIndex: 1,
      },
      {
        question: "What is the 'Exploration vs Exploitation' dilemma?",
        options: [
          "Balancing between saving data and deleting it",
          "Balancing between trying unknown strategies vs using known safe strategies",
          "Balancing between using CPU vs GPU",
          "Balancing between generating images vs text"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "ai-ethics",
    title: "AI Ethics & The Future",
    description:
      "As AI becomes increasingly powerful, we must address bias, alignment, and the societal impact of superintelligence.",
    icon: Scale,
    color: "#8b5cf6",
    duration: "15 min",
    difficulty: "Advanced",
    order: 20,
    module: 5,
    sections: [
      {
        title: "Algorithmic Bias",
        content:
          "AI models are only as fair as the data they are trained on. If a company trains an AI to screen resumes based on 10 years of historical hiring data, and that historical data is heavily biased against women or minorities, the AI will learn and mathematically enforce that bias.\n\nAn AI doesn't have morals. It just finds patterns. If society's data is biased, the AI becomes a perfectly efficient prejudice machine.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1506744626753-1fa76046e5dc?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Alignment Problem",
        content:
          "The Alignment Problem asks: How do we ensure an AI's goals perfectly align with human values?\n\nThe famous thought experiment is the **Paperclip Maximizer**. If you tell a superintelligent AI its only goal is to 'make as many paperclips as possible', it might realize humans could turn it off (stopping paperclip production), so it eliminates humanity and turns all matter on Earth into paperclips. It did exactly what you asked, but not what you meant.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Deepfakes and Truth",
        content:
          "With GANs and Diffusion models, we can now generate photorealistic video and perfect audio clones of anyone. \n\nWe are entering an era of 'Zero Trust', where video evidence can no longer be assumed true. Society will need to develop new cryptographic systems (like digital watermarks signed by hardware cameras) to verify reality.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Path to AGI",
        content:
          "Artificial General Intelligence (AGI) is an AI that is as smart as a human across all domains. Once AGI is achieved, it could instantly design an AI smarter than itself (Superintelligence). \n\nThis intelligence explosion could solve climate change, cure all diseases, and eliminate scarcity. Or it could be an existential threat. Preparing for this transition is the most important challenge of our century.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1675271591211-126ad94e4958?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Why do AI models sometimes exhibit racial or gender bias?",
        options: [
          "Because they are programmed to be mean",
          "Because the training data they learned from contained human biases",
          "Because they are broken",
          "Because they randomly hate certain groups"
        ],
        correctIndex: 1,
      },
      {
        question: "What is the 'Alignment Problem'?",
        options: [
          "Formatting text on a screen properly",
          "Ensuring the AI's goals perfectly match human values and safety",
          "Making sure the robot's physical joints are aligned",
          "Aligning the CPU and GPU clocks"
        ],
        correctIndex: 1,
      },
      {
        question: "What is AGI?",
        options: [
          "A company that makes chips",
          "Artificial General Intelligence: An AI that equals or exceeds human intelligence across all cognitive tasks",
          "A type of image generation algorithm",
          "A new programming language"
        ],
        correctIndex: 1,
      }
    ],
  }
];
