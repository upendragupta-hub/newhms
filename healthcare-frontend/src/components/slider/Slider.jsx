import { Swiper, SwiperSlide } from "swiper/react";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// modules
import { Pagination, Autoplay } from "swiper/modules";

const Slider = () => {
    return (
        <div className="w-full h-80 sm:h-[420px] md:h-[520px]">

            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                speed={1000}
                loop={true}
                className="w-full h-80 sm:h-[420px] md:h-[520px]"
            >

                <SwiperSlide>
                    <img
                        className="w-full h-full object-cover"
                        src="https://plus.unsplash.com/premium_photo-1681966826227-d008a1cfe9c7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <img
                        className="w-full h-full object-cover"
                        src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <img
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                    />
                </SwiperSlide>

            </Swiper>
        </div>
    );
};

export default Slider;