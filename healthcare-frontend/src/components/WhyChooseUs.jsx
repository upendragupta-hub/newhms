import React from 'react'

const WhyChooseUs = () => {
  return (
    <div>
  


        <section className="py-20 bg-gray-100">

    <div className="max-w-7xl mx-auto px-5">

        <h2 className="text-5xl font-bold text-center text-blue-600 mb-14">
            Why Choose Us
        </h2>



        <div className="grid md:grid-cols-4 gap-8">

            {/* CARD 1 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

                <h3 className="text-2xl font-bold mb-4">
                    Expert Doctors
                </h3>

                <p className="text-gray-600">
                    Highly experienced doctors providing the best treatment.
                </p>

            </div>



            {/* CARD 2 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

                <h3 className="text-2xl font-bold mb-4">
                    24/7 Emergency
                </h3>

                <p className="text-gray-600">
                    Emergency services available anytime for critical care.
                </p>

            </div>



            {/* CARD 3 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

                <h3 className="text-2xl font-bold mb-4">
                    Modern Equipment
                </h3>

                <p className="text-gray-600">
                    Advanced medical technology for accurate diagnosis.
                </p>

            </div>



            {/* CARD 4 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

                <h3 className="text-2xl font-bold mb-4">
                    Patient Care
                </h3>

                <p className="text-gray-600">
                    Dedicated staff focused on patient comfort and safety.
                </p>

            </div>

        </div>

    </div>

</section>


    </div>
  )
}

export default WhyChooseUs