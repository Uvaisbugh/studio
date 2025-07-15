import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center justify-center size-10 bg-primary/20 rounded-full">
          <BrainCircuit className="size-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Aura Vision
        </h1>
      </div>
    </header>
  );
}
