import { Link } from 'react-router-dom';

function SignUpPage() {
  return (
    <div className="h-screen w-full hero-bg">
      <header className="max-w-6xl mx-auto flex items-center justify-center p-4">
        <Link to={'/'}>
          <img src="/netflix-logo.png" alt="logo" className="w-52" />
        </Link>
      </header>

      
    </div>
  );
}

export default SignUpPage;
