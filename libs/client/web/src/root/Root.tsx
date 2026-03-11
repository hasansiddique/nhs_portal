import { Link } from 'react-router-dom';

export const Root = () => {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <h1>This is the index page</h1>
      <div>
        <ul>
          <li>
            <Link to="/home">Home page</Link>
          </li>
          <li>
            <Link to="/movies">Movies page</Link>
          </li>
          <li>
            <Link to="/actors">Actors page</Link>
          </li>
          <li>
            <Link to="/auth/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link to="/auth/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/dashboard/reports">Dashboard</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
