# Dinou Starter App

This project was bootstrapped with `create-dinou`.

It is a lightweight-ejectable Full-Stack React 19 application configured with Server Components, Server Functions, Streaming SSR, and Hybrid Rendering.

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/page.tsx`. The page auto-updates as you edit the file.

## 📂 Project Structure

Dinou uses a **file-system based router**. Your file structure defines your URL paths.

```text
.
├── favicons/        # Static favicon assets
├── src/
│   ├── components/  # Shared React components
│   ├── layout.tsx   # Root layout (wraps all pages)
│   ├── page.tsx     # Home page route (/)
│   └── ...          # Other routes
├── package.json
└── README.md
```

### Routing Examples

- `src/page.tsx` → `localhost:3000/`
- `src/about/page.tsx` → `localhost:3000/about`
- `src/blog/[slug]/page.tsx` → `localhost:3000/blog/hello-world`

## 🛠️ Scripts

Dinou allows running the application using Webpack, Rollup, or Esbuild (default).

- **Development:**
  - `npm run dev` (or `npm run dev:esbuild`): Starts the development server using Esbuild.
  - `npm run dev:rollup`: Starts the development server using Rollup.
  - `npm run dev:webpack`: Starts the development server using Webpack.
- **Production Build:**
  - `npm run build` (or `npm run build:esbuild`): Builds and compiles static pages using Esbuild.
  - `npm run build:rollup`: Builds and compiles static pages using Rollup.
  - `npm run build:webpack`: Builds and compiles static pages using Webpack.
- **Production Start:**
  - `npm start` (or `npm run start:esbuild`): Runs the Esbuild built app.
  - `npm run start:rollup`: Runs the Rollup built app.
  - `npm run start:webpack`: Runs the Webpack built app.

## ⚡ Key Features Available

- **React Server Components:** Native integration of React 19 Server Components, streaming HTML/RSC payloads progressively using `renderToPipeableStream` and Suspense.
- **Server Functions:** Functions marked with `"use server"` that execute on the server and can be called from client components. Supports returning rendered React components (Server or Client) directly to the client.
- **Hybrid Rendering:** Static by default (SSG). Bypasses static files and evaluates dynamically at request time if the request accesses headers, cookies, or query parameters.
- **Client Router:** Client-side soft navigation with directory-first relative routing and prefetching on `<Link>` hover.
- **Bundler Agnostic:** Supports Webpack, Rollup, and Esbuild as build engines, allowing you to choose your preferred compilation integration.
- **Styling:** CSS Modules and Tailwind CSS are supported out of the box.

## 📚 Learn More

To learn more about Dinou, check out the following resources:

- [Dinou Documentation](https://dinou.dev) - learn about Dinou features and API.
- [Dinou GitHub Repository](https://github.com/roggc/dinou) - your feedback and contributions are welcome!

## ☁️ Deployment

To deploy your Dinou app, build it locally and start the server, or deploy to any Node.js hosting provider.

```bash
npm run build
npm start
```
