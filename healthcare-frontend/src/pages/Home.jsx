import React from 'react'
import Slider from '../components/slider/Slider'
import Facilities from '../components/Facilities'
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


<Facilities/>
<Doctors/>
<DoctorRegister/>
<WhatsappButton />




    </>
  )
}

export default Home
