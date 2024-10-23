import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-400 p-5"
    style={{
      backgroundImage: "url('/chat-pattern.png')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}>
      <header className="bg-green-300 shadow-lg rounded-lg p-8 mb-10 transform transition duration-500 hover:scale-105">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to ChatVerse!</h1>
        <p className="mt-2 text-gray-700">Your real-time chat solution</p>
      </header>
      <main className="flex-grow">
        <section className="bg-green-300 rounded-lg shadow-md p-10 text-center transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl font-bold text-blue-600">Hello, User!</h2>
          <p className="mt-4 text-gray-700">Connect with friends, family, and colleagues in real-time.</p>
          
        </section>
      </main>
      <footer className="mt-10 text-gray-1000 text-sm">
        <p>© 2024 ChatVerse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

