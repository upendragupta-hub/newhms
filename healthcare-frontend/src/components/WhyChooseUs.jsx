import React from 'react'

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-blue-600 sm:text-5xl mb-14">
          Why Choose Us
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Expert Doctors</h3>
            <p className="text-gray-600">
              Highly experienced doctors providing the best treatment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">24/7 Emergency</h3>
            <p className="text-gray-600">
              Emergency services available anytime for critical care.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Modern Equipment</h3>
            <p className="text-gray-600">
              Advanced medical technology for accurate diagnosis.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Patient Care</h3>
            <p className="text-gray-600">
              Dedicated staff focused on patient comfort and safety.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs