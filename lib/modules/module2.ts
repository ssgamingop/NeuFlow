import { TrendingUp, Target, GitMerge, CheckSquare } from "lucide-react";
import { LessonData } from "../lesson.types";

export const module2: LessonData[] = [
  {
    slug: "linear-regression",
    title: "Linear Regression",
    description:
      "The simplest yet most powerful predictive model. Learn how to draw the line of best fit through chaotic data.",
    icon: TrendingUp,
    color: "#f59e0b",
    duration: "10 min",
    difficulty: "Beginner",
    order: 5,
    module: 2,
    sections: [
      {
        title: "Predicting Continuous Numbers",
        content:
          "Linear Regression is the grandfather of machine learning. It's used when we want to predict a continuous number (like house price, temperature, or stock value).\n\nIf we have data plotting House Size (X-axis) against Price (Y-axis), Linear Regression finds the mathematical 'line of best fit' that cuts perfectly through the middle of all those points.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Equation: y = mx + b",
        content:
          "The algorithm is literally just finding two numbers: the slope (`m`) and the intercept (`b`).\n\nThe AI starts with a random line. It measures the distance from the line to every single data point (the Error). Then, using Gradient Descent, it adjusts the line's slope and height slightly. It repeats this until the total error is as small as possible.",
        visualType: "3d",
        visualComponent: "RegressionLine3D",
      },
      {
        title: "Multiple Linear Regression",
        content:
          "What if price depends on more than just size? What if it depends on Bedrooms, Age, and Zip Code?\n\nWe move from a 2D line to a multi-dimensional plane. The equation becomes: `y = (m1 * x1) + (m2 * x2) + ... + b`. The math works exactly the same, we just optimize more parameters simultaneously. Humans can't visualize a 5-dimensional plane, but to an algorithm, it's trivial.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Linear Regression is primarily used to predict:",
        options: [
          "Categories (like Spam or Not Spam)",
          "Continuous numbers (like Price)",
          "Images",
          "Text"
        ],
        correctIndex: 1,
      },
      {
        question: "How does the model find the 'best fit' line?",
        options: [
          "By asking the user",
          "By connecting the first and last point",
          "By minimizing the total error/distance between the line and the data points",
          "By using random numbers"
        ],
        correctIndex: 2,
      }
    ],
  },
  {
    slug: "classification",
    title: "Classification & Logistic",
    description:
      "How does an AI choose between Category A and Category B? Step into the math of boundaries.",
    icon: Target,
    color: "#10b981",
    duration: "11 min",
    difficulty: "Beginner",
    order: 6,
    module: 2,
    sections: [
      {
        title: "Categorical Predictions",
        content:
          "Unlike Regression (which predicts numbers), **Classification** predicts categories. Is this email Spam or Not Spam? Is this tumor Malignant or Benign?\n\nInstead of fitting a line *through* the data, we want to draw a boundary *between* the data groups.",
        visualType: "3d",
        visualComponent: "ScatterPlot3D",
      },
      {
        title: "Logistic Regression",
        content:
          "Despite the name, Logistic Regression is a classification algorithm. \n\nInstead of outputting a straight line (which can go to infinity), we pass the line through a **Sigmoid Function**, which violently squishes all outputs to be strictly between 0 and 1. \n\nThis gives us a probability! If the output is 0.85, the model is 85% sure the email is Spam. We just set a threshold: anything above 0.5 is Spam.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1620825937374-87fc7d6daf02?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Multi-class Classification",
        content:
          "What if we have more than two categories? (e.g., Cat, Dog, or Bird).\n\nWe use a function called **Softmax**. It ensures that no matter what the raw network outputs are, they are converted into probabilities that all add up to exactly 100%. So the AI might output: [Cat: 70%, Dog: 20%, Bird: 10%].",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Logistic Regression is used for:",
        options: [
          "Predicting continuous numbers",
          "Classification (predicting categories/probabilities)",
          "Generating images",
          "Translating languages"
        ],
        correctIndex: 1,
      },
      {
        question: "What function guarantees multiple category predictions add up to 100%?",
        options: [
          "Linear",
          "Sigmoid",
          "Softmax",
          "ReLU"
        ],
        correctIndex: 2,
      }
    ],
  },
  {
    slug: "decision-trees",
    title: "Decision Trees & Forests",
    description:
      "A logical, human-readable way for AI to make decisions by splitting data recursively.",
    icon: GitMerge,
    color: "#22c55e",
    duration: "13 min",
    difficulty: "Intermediate",
    order: 7,
    module: 2,
    sections: [
      {
        title: "A Game of 20 Questions",
        content:
          "A **Decision Tree** works exactly like the game 20 Questions. It looks at all the data and finds the single best True/False question that splits the data into the purest groups.\n\nFor example, predicting if someone will buy a sports car: \nFirst split: *Is Age < 30?* \nSecond split: *Is Income > $100k?*\nThe data flows down the branches until it reaches a final prediction 'leaf'.",
        visualType: "3d",
        visualComponent: "DecisionTree3D",
      },
      {
        title: "The Danger of Overfitting",
        content:
          "Decision Trees are incredibly interpretable (you can read the rules!), but they have a fatal flaw: they love to overfit. \n\nIf you don't limit their depth, a tree will just keep asking questions until it memorizes every single individual row in the training data, capturing all the noise and failing completely on new data.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1506744626753-1fa76046e5dc?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Solution: Random Forests",
        content:
          "How do you fix a tree that overfits? Plant a forest.\n\nA **Random Forest** trains 100 different, slightly randomized decision trees. When a new prediction needs to be made, all 100 trees vote on the outcome, and the majority wins.\n\nThis is an example of an **Ensemble Model**. The wisdom of the crowd smooths out the errors of any individual overfitted tree.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "What is the primary weakness of a single Decision Tree?",
        options: [
          "It is too slow",
          "It is hard for humans to read",
          "It tends to overfit and memorize training data",
          "It only works on images"
        ],
        correctIndex: 2,
      },
      {
        question: "How does a Random Forest make predictions?",
        options: [
          "By picking the single best tree",
          "By having many trees vote and taking the majority",
          "By using a neural network",
          "By doing linear regression"
        ],
        correctIndex: 1,
      }
    ],
  },
  {
    slug: "evaluation-metrics",
    title: "Model Evaluation & Metrics",
    description:
      "Accuracy is a lie. Learn how we truly measure the performance and safety of AI models.",
    icon: CheckSquare,
    color: "#6366f1",
    duration: "12 min",
    difficulty: "Intermediate",
    order: 8,
    module: 2,
    sections: [
      {
        title: "The Accuracy Trap",
        content:
          "If a disease affects 1% of the population, I can write a model that *always* says 'Healthy' no matter what. My model is technically 99% accurate! But it is 100% useless.\n\n**Accuracy** (Total Correct / Total Predictions) is a terrible metric when dealing with imbalanced data. We need better tools to evaluate performance.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "The Confusion Matrix",
        content:
          "To truly understand performance, we build a 2x2 grid showing the exact types of mistakes the model makes:\n\n1. **True Positives (TP)**: Sick people correctly identified as Sick.\n2. **True Negatives (TN)**: Healthy people correctly identified as Healthy.\n3. **False Positives (FP)**: Healthy people falsely flagged as Sick (Type 1 error).\n4. **False Negatives (FN)**: Sick people falsely flagged as Healthy (Type 2 error).",
        visualType: "3d",
        visualComponent: "ConfusionMatrix3D",
      },
      {
        title: "Precision vs Recall",
        content:
          "From the matrix, we derive two critical metrics:\n\n**Precision**: Out of all the people the model *claimed* were sick, how many actually were? (Crucial when false positives are expensive, e.g., spam filters).\n\n**Recall**: Out of all the people who were *actually* sick, how many did the model find? (Crucial when false negatives are deadly, e.g., cancer screening).\n\nUsually, you have to trade one for the other.",
        visualType: "image",
        visualUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
      }
    ],
    quiz: [
      {
        question: "Why is Accuracy a misleading metric for rare diseases?",
        options: [
          "It's too hard to calculate",
          "A model can just guess 'Healthy' every time and still get a high score",
          "It doesn't work on medical data",
          "Diseases aren't predictable"
        ],
        correctIndex: 1,
      },
      {
        question: "Which metric is most important for a cancer screening AI?",
        options: [
          "Precision (minimize false alarms)",
          "Recall (minimize missed cancer cases)",
          "Accuracy",
          "Speed"
        ],
        correctIndex: 1,
      },
      {
        question: "What is a False Positive?",
        options: [
          "Correctly identifying a positive case",
          "Incorrectly identifying a negative case as positive",
          "Missing a positive case",
          "A bug in the code"
        ],
        correctIndex: 1,
      }
    ],
  }
];
