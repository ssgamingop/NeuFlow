import { Brain, TrendingDown, Activity, ShieldAlert } from "lucide-react";
import { LessonData } from "../lesson.types";

export const module3: LessonData[] = [
  {
    slug: "neural-networks",
    title: "Biological Architectures",
    description:
      "Dive inside the deep network nodes and edges that make up complex deep learning systems.",
    icon: Brain,
    color: "#06b6d4",
    duration: "12 min",
    difficulty: "Intermediate",
    order: 9,
    module: 3,
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
          "Let's zoom into a single neuron. What happens inside?\n\n1. It receives inputs from several previous neurons.\n2. Each connection has a **Weight** — essentially saying 'how important is this specific signal?'\n3. It multiplies the inputs by the weights, adds a **Bias** (a base threshold), and sums them all up.\n4. It passes that sum through an **Activation Function** — a mathematical gatekeeper that decides 'should I fire and send a signal forward, or stay quiet?'",
        visualType: "3d",
        visualComponent: "SingleNeuron3D",
      },
      {
        title: "Forward Propagation",
        content:
          "When data moves from the input layer, through the hidden layers, and out to a prediction, we call this **Forward Propagation**.\n\nIt is entirely deterministic math. If you lock the weights, the exact same image will always produce the exact same prediction. There is no 'thinking' happening in real-time, just millions of rapid multiplications.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Backpropagation",
        content:
          "How does the network actually 'learn'? It uses an algorithm called **Backpropagation**.\n\nImagine the network makes a guess: it looks at a picture of a Stop Sign and says 'Speed Limit'. \nThis is wrong. We calculate the Error.\n\nThe math then flows *backwards* through the network. Using the chain rule of calculus, it asks each neuron: 'How much were you responsible for this error?' The neurons adjust their weights slightly so next time, they won't make the same mistake. Do this millions of times, and the network becomes highly accurate.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
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
      {
        question: "What is the process of passing data forward to get a prediction called?",
        options: [
          "Backpropagation",
          "Forward Propagation",
          "Gradient Descent",
          "Optimization"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent Optimization",
    description:
      "Visualize how mathematical models minimize their failure rates by physically rolling down an algorithmic hillside.",
    icon: TrendingDown,
    color: "#22d3ee",
    duration: "10 min",
    difficulty: "Intermediate",
    order: 10,
    module: 3,
    sections: [
      {
        title: "The Landscape of Error",
        content:
          "When an AI starts training, it guesses randomly and makes terrible predictions. Its 'Error' or 'Cost' is extremely high.\n\nImagine this Error as a literal 3D mountain landscape. Getting the right answer means reaching the lowest valley (zero error). But the AI is blindfolded. It can only feel the slope of the ground right under its feet.",
        visualType: "3d",
        visualComponent: "GradientSurface3D",
      },
      {
        title: "Taking the Step",
        content:
          "The algorithm to get down the mountain is called **Gradient Descent**.\n\n1. Use calculus to find the slope (the gradient) at the current position.\n2. Point your foot downhill.\n3. Take a step down.\n4. Repeat until the ground is flat (you are in the valley minimum).",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Learning Rate",
        content:
          "The size of the step you take is called the **Learning Rate**. This is crucial.\n\nIf you take tiny baby steps (small learning rate), you'll definitely reach the bottom, but it will take thousands of years. You waste computing power.\n\nIf you take giant leaps (huge learning rate), you'll completely miss the valley out of momentum, jumping to the opposite mountain side and bouncing around out of control.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1616492318469-87a32bd05bc5?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Local vs Global Minima",
        content:
          "What if the landscape has multiple valleys? A shallow valley (Local Minimum) and a deep, perfect valley (Global Minimum).\n\nStandard gradient descent can get trapped in the shallow valley because all directions go 'up'. To fix this, modern optimizers (like Adam or SGD with Momentum) act like a heavy ball rolling down the hill. They build up 'speed', allowing them to blast through small hills and escape shallow valleys to find the true bottom.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "What does the 'Landscape' represent in Gradient Descent?",
        options: [
          "The amount of data available",
          "The model's Prediction Error (Cost)",
          "The speed of the network",
          "The number of layers",
        ],
        correctIndex: 1,
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
      {
        question: "How do modern optimizers like Momentum avoid getting stuck in local minima?",
        options: [
          "They teleport randomly",
          "They build up speed to roll over small hills",
          "They flatten the mountain",
          "They ask the user for help"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "activation-functions",
    title: "Activation Functions",
    description:
      "Why neural networks need non-linear math to solve complex problems, and the infamous Vanishing Gradient.",
    icon: Activity,
    color: "#eab308",
    duration: "11 min",
    difficulty: "Intermediate",
    order: 11,
    module: 3,
    sections: [
      {
        title: "The Need for Non-Linearity",
        content:
          "If a neural network only multiplied weights and added them up, it would just be one giant Linear Regression line. No matter how many layers you stack, line + line + line = line.\n\nBut the real world isn't a straight line. To learn curves, circles, and complex boundaries, we must introduce **Non-Linearity**. This is the job of the Activation Function.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Sigmoid and Tanh",
        content:
          "Early networks used the **Sigmoid** function, which gently curves inputs to a range between 0 and 1. Another is **Tanh**, which curves between -1 and 1.\n\nThese functions are beautiful because they act like organic neurons: either firing strongly (1), staying quiet (0), or somewhere in between.",
        visualType: "3d",
        visualComponent: "ActivationFunctions3D",
      },
      {
        title: "The Vanishing Gradient Problem",
        content:
          "But Sigmoid has a deadly flaw. If you input a very high number (like 100) or a very low number (-100), the slope (gradient) at the ends of the curve is almost perfectly flat (0).\n\nDuring Backpropagation, multiplying by 0 kills the gradient. The error signal 'vanishes' as it travels backward through deep layers, meaning the earliest layers of the network completely stop learning.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "ReLU: The Modern Savior",
        content:
          "The solution was painfully simple: **ReLU (Rectified Linear Unit)**.\n\nReLU's rule is: *If the input is negative, output 0. If it's positive, output the exact same number.* \n\nBecause the positive side is a straight 45-degree line, the slope is always 1. The gradient never vanishes! This single mathematical trick is largely responsible for enabling the massive 'Deep' neural networks we use today.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Why do neural networks need activation functions?",
        options: [
          "To make the code compile",
          "To introduce non-linearity so the network can learn complex curves",
          "To speed up the GPU",
          "To format the output text"
        ],
        correctIndex: 1,
      },
      {
        question: "What causes the Vanishing Gradient problem?",
        options: [
          "Missing data",
          "Functions like Sigmoid flattening out at the extremes, killing the error signal",
          "A learning rate that is too high",
          "Using too many GPUs"
        ],
        correctIndex: 1,
      },
      {
        question: "Which activation function solved the vanishing gradient problem for deep networks?",
        options: [
          "Sigmoid",
          "Tanh",
          "Softmax",
          "ReLU"
        ],
        correctIndex: 3,
      }
    ],
  },
  {
    slug: "regularization",
    title: "Overfitting & Dropout",
    description:
      "When a neural network memorizes too much, it becomes useless. Learn how we force models to generalize.",
    icon: ShieldAlert,
    color: "#ef4444",
    duration: "13 min",
    difficulty: "Intermediate",
    order: 12,
    module: 3,
    sections: [
      {
        title: "The Curse of Memorization",
        content:
          "Deep Neural Networks are incredibly powerful—sometimes too powerful. With millions of parameters, a network can simply memorize the training data instead of learning the underlying concepts.\n\nImagine a student who memorizes a practice math test but fails the real exam because the numbers changed. This is **Overfitting**.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1506744626753-1fa76046e5dc?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Validation Datasets",
        content:
          "To catch overfitting, we split our data. We train the AI on 80% (Training Set) and hide the other 20% (Validation Set).\n\nWhile training, we constantly test the AI on the hidden 20%. If the Training error goes down, but the Validation error starts going *up*, we know the AI is starting to memorize. We hit the brakes and stop training.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Dropout: Algorithmic Sabotage",
        content:
          "One brilliant way to stop overfitting is **Dropout**. \n\nDuring training, we randomly turn off (drop out) 20-50% of the neurons in the network every single step! \n\nWhy? Because it forces the remaining neurons to step up and learn useful features independently, rather than relying on a few 'super-neurons' to do all the work. It builds a much more robust, generalized brain.",
        visualType: "3d",
        visualComponent: "WordEmbeddings3D", // Placeholder
      },
      {
        title: "Weight Decay (L2 Regularization)",
        content:
          "Another technique is **Weight Decay**. We mathematically punish the network for having weights that are too large.\n\nBy adding a penalty to the loss function based on the size of the weights, we force the network to keep its connections small and simple. Simpler models are statistically less likely to overfit.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "What is the purpose of a Validation Set?",
        options: [
          "To give the model more data to memorize",
          "To test the model on unseen data to detect overfitting",
          "To replace the training set",
          "To clean the data"
        ],
        correctIndex: 1,
      },
      {
        question: "How does Dropout prevent overfitting?",
        options: [
          "It deletes the training data",
          "It stops training immediately",
          "It randomly disables neurons during training, forcing the network to be robust",
          "It drops the learning rate"
        ],
        correctIndex: 2,
      }
    ],
  }
];
