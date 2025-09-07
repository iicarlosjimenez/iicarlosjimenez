export default function Main({ children }) {
  return (
    <main className="min-h-[88vh] py-2 px-3 flex flex-col gap-4 text-center justify-center items-center">
      {children}
    </main>
  );
}