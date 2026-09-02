import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md text-center">

        {/* Icon */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100">
          <SearchX
            size={36}
            className="text-zinc-500"
          />
        </div>

        {/* Error */}

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Error 404
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          The page you're looking for doesn't exist
          or may have been moved.
        </p>

        {/* Actions */}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <Home size={17} />
            Dashboard
          </button>

        </div>

      </div>
    </div>
  );
}