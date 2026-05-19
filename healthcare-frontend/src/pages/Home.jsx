import React from 'react'
import Slider from '../components/slider/Slider'
import Facilities from '../components/Facilities'
import BedAvailability from '../components/BedAvailability'
import Intro from '../components/Intro'
import WhyChooseUs from '../components/WhyChooseUs'
import Doctors from './Doctors'
import WhatsappButton from '../components/WhatsappButton'
import DoctorRegister from './DoctorRegister'

const Home = () => {
  return (
    <>
<Slider />
<Intro />
<WhyChooseUs />
<BedAvailability />
<Facilities/>
<Doctors/>
<DoctorRegister/>
<WhatsappButton />




    </>
  )
}

export default Home
