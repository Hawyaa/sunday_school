import React from "react";
import Link from "next/link";

const EventPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Eventify</h1>
          <nav className="space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-800">
              About
            </Link>
            <Link href="/events" className="text-gray-600 hover:text-gray-800">
              Events
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-800">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Upcoming Events</h2>
          <p className="text-lg mb-6">
            Join us for exciting events, workshops, and gatherings.
          </p>
          <Link
            href="/events"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section className="container mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Upcoming Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Event Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/images/event1.jpg"
              alt="Event 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-xl font-bold text-gray-800">
                Meskel Celebration
              </h4>
              <p className="text-gray-600 mt-2">September 15, 2023</p>
              <p className="text-gray-600">Church Hall</p>
              <Link
                href="/events/meskel"
                className="text-blue-600 hover:underline mt-4 block"
              >
                Learn More &rarr;
              </Link>
            </div>
          </div>
          {/* Repeat Event Cards */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/images/event2.jpg"
              alt="Event 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-xl font-bold text-gray-800">
                Youth Fellowship
              </h4>
              <p className="text-gray-600 mt-2">October 9, 2023</p>
              <p className="text-gray-600">Church Hall</p>
              <Link
                href="/events/youth"
                className="text-blue-600 hover:underline mt-4 block"
              >
                Learn More &rarr;
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/images/event3.jpg"
              alt="Event 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-xl font-bold text-gray-800">Bible Study</h4>
              <p className="text-gray-600 mt-2">October 6, 2023</p>
              <p className="text-gray-600">Church Hall</p>
              <Link
                href="/events/bible"
                className="text-blue-600 hover:underline mt-4 block"
              >
                Learn More &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2023 Eventify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EventPage;
