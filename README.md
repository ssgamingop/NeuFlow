# NeuFlow AI Learning Platform

Welcome to **NeuFlow**, a highly interactive, beautifully animated educational platform designed to demystify Artificial Intelligence and Machine Learning. NeuFlow bridges the gap between theoretical AI concepts and intuitive human understanding through **real-time 3D WebGL visualizations** and mathematically synced **GSAP scroll animations**.

## 🌟 The Vision

AI is often perceived as "magic" by beginners. NeuFlow strips away the sci-fi tropes by placing users directly inside the architecture of Neural Networks, Gradient Descent algorithms, and Large Language Models (LLMs). By interacting with physical 3D simulations of tensors, tokens, and attention layers, learners can *see* how data translates into intelligence.

## 🚀 Core Features

- **Massive 3D Visualizations**: Built with React Three Fiber, the platform renders live WebGL scenes representing Neural Networks, Gradient Descent landscapes, and NLP Word Embeddings.
- **Scroll-Sync Physics**: Utilizing GSAP's `ScrollTrigger`, UI components and 3D scenes scrub backwards and forwards perfectly in sync with the user's scroll depth.
- **Interactive Simulators**: Hands-on environments where users can adjust learning rates, add hidden layers, and watch forward/backpropagation occur in real-time.
- **8-Module Mastery Curriculum**: A comprehensive, beginner-friendly course starting at "What is AI?", passing through "Computer Vision (CNNs)", and ending at "How LLMs Work."
- **Progress Tracking**: Persistent local state management saving lesson completion and quiz performance using `zustand`.

## 🛠️ Tech Stack

NeuFlow is built utilizing state-of-the-art web frameworks to guarantee 60FPS fluid animations alongside demanding 3D calculations.

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19) with Turbopack.
- **3D Engine**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction).
- **Animation Physics**: [GSAP](https://gsap.com/) & `@gsap/react` for raw DOM manipulation and Timeline scrubbing.
- **Component Teardowns**: [Framer Motion](https://www.framer.com/motion/) for unmounting complex React component arrays safely.
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) with pure CSS variables and glassmorphism.
- **Global State**: [Zustand](https://github.com/pmndrs/zustand).

## 💻 Running Locally

NeuFlow requires Node.js (v18+) to run.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/neuflow.git
cd neuflow

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Navigate to `http://localhost:3000` to view the platform.

## 📂 Architecture Highlight

### The Curriculum (`lib/lessons.ts`)
The entire platform is statically powered by a central curriculum graph. To add a new lesson:
1. Open `lib/lessons.ts`.
2. Add a new `LessonData` object to the `lessons` array.
3. Pass `visualType: "3d"` and link one of the R3F components (e.g., `WordEmbeddings3D`) to automatically inject gorgeous WebGL into the right-hand split-screen of the lesson reader!

### The Immersive Canvas
NeuFlow strictly limits heavy WebGL execution to the active viewport using Next's `dynamic()` lazy importing alongside R3F `<Canvas>` unmounting to ensure massive performance gains.

---
*Built with ❤️ for the future of AI education.*
