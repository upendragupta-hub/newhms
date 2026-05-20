import React from 'react'

const Intro = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 sm:text-5xl">
            About me
          </h2>
        </div>
        <div className="grid gap-12 items-center md:grid-cols-2">

        {/* LEFT IMAGE */}

        <img
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
            alt="Hospital"
            className="rounded-2xl shadow-lg"
        />


        {/* RIGHT CONTENT */}

        <div>

            <h2 className="text-4xl font-bold text-blue-600 mb-6">
                Welcome To Our Hospital
            </h2>

            <p className="text-gray-600 text-lg leading-8 mb-5">

                We provide world-class healthcare services with experienced doctors,
                modern facilities, and advanced medical technology.
                Our mission is to deliver compassionate and quality care
                for every patient.

            </p>

            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                Learn More
            </button>

        </div>

      </div>

    </div>

</section>
  )
}

export default Intro