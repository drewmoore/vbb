import Form from "@/components/form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p>top-left corner</p>
      </div>

      <div className="relative flex place-items-center">
        <h1>My Transit App</h1>

        <Form />
      </div>
    </main>
  );
}
