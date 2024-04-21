'use client'
import React from 'react';

function ErrorPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">Oops!</h1>
        <p className="text-xl mt-4">We can't seem to find the page you're looking for.</p>
        <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300" onClick={() => window.history.back()}>Go Back</button>
      </div>
    </div>
  );
}

export default ErrorPage;
