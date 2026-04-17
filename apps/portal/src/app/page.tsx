import CreateJobForm from "#/components/CreateJobForm";
import JobButton from "#/components/JobButton";
import JobCancelButton from "#/components/JobCancelButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="max-w-2xl w-full text-center sm:text-left space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Platform Messenger
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Quickly view and manage the current job queue from the Messenger service.
          </p>
        </div>

        <CreateJobForm />
      </main>
    </div>
  );
}