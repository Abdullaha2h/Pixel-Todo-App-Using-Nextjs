import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
 
      <section className="bg-card rounded-2xl p-5 mt-20 shadow-md">
        <h1 className="text-2xl font-semibold mb-2">Welcome to Todo App</h1>
        <p className="text-muted-foreground">
          Sign up or log in to start managing your todos.
        </p>
      </section>
    </div>
  );
}
