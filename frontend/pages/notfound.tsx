import { Link } from "react-router-dom";


export default function NotFound() {

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-white">


      <div className="text-center">
6

        <h1 className="text-7xl font-bold text-pink-400">
          404
        </h1>


        <h2 className="mt-4 text-3xl font-semibold">
          Page not found
        </h2>


        <p className="mt-3 text-slate-400">
          The page you are looking for does not exist.
        </p>



        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 font-semibold"
        >
          Go home
        </Link>


      </div>


    </div>

  );

}