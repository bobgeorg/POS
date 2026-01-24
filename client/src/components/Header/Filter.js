import React, { useState, useRef, useEffect } from "react";
import FoodFilter from "./FoodFilter";
import Slider from "react-slick";
import {Types} from "./Types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import { BorderLeft } from "@material-ui/icons";
// console.log("type...........<<<<<<..", Types);
const Filter = ({ x, Foods, Typess }) => {
  // Typess.push({image:"/image/FoodsType/ALL.jpg", name:"Tất cả món"})
  console.log("x........Typess", Typess);
  const [selected, setSelected] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef({});
  const scrollRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const next = () => {
    if (isMobile && scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    } else if (ref.current.slickNext) {
      ref.current.slickNext();
    }
  };

  const previous = () => {
    if (isMobile && scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    } else if (ref.current.slickPrev) {
      ref.current.slickPrev();
    }
  };

  const settings = {
    className: "section-outstanding__slider hoangkui-css-filter",
    slidesToShow: Math.min(4, Typess.length), // Don't show more slides than we have items
    slidesToScroll: 1,
    arrows: false,
    infinite: Typess.length > 4, // Only enable infinite if we have more items than visible
    rows: 1,
    centered: "true",
    swipe: Typess.length > 4, // Only enable swipe if infinite
    draggable: Typess.length > 4, // Only enable drag if infinite
    // centerPadding:0,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          className: "stick-list-cc",
          slidesToShow: Math.min(3, Typess.length),
          slidesToScroll: 1,
          rows: 1,
          infinite: Typess.length > 3,
          swipe: Typess.length > 3,
          draggable: Typess.length > 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, Typess.length),
          slidesToScroll: 1,
          rows: 1,
          infinite: Typess.length > 2,
          swipe: Typess.length > 2,
          draggable: Typess.length > 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: Math.min(2, Typess.length),
          slidesToScroll: 1,
          rows: 1,
          infinite: Typess.length > 2,
          swipe: Typess.length > 2,
          draggable: Typess.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          infinite: Typess.length > 1,
          swipe: Typess.length > 1,
          draggable: Typess.length > 1,
        },
      },
    ],
  };
  const handleOneSelected = (id) => {
    setSelected(id);
  };

  useEffect(() => {
    return () => {
      console.log("pre", selected);
    };
  }, [selected]);

  // const [types, setTypes] = useState(Typess);
  // console.log("asdfgh", Typess)
  return (
    <>
      <div className="filter-container">
        <div className="button-filter button-back">
          <div onClick={previous} className="arrow-left-food arrow-food"></div>
        </div>

        {isMobile ? (
          // Mobile: Use native scroll with scroll-snap
          <div className="mobile-filter-scroll" ref={scrollRef}>
            {Typess.map((typeFood, index) => {
              return (
                <FoodFilter
                  handleOneSelected={handleOneSelected}
                  selected={selected}
                  key={typeFood._id}
                  name={typeFood.name}
                  id={index}
                  x_value={x}
                  Typesss={Typess}
                  _id={typeFood._id}
                />
              );
            })}
          </div>
        ) : (
          // Desktop: Use react-slick
          <Slider ref={ref} {...settings}>
            {Typess.map((typeFood, index) => {
              return (
                <FoodFilter
                  handleOneSelected={handleOneSelected}
                  selected={selected}
                  key={typeFood._id}
                  name={typeFood.name}
                  id={index}
                  x_value={x}
                  Typesss={Typess}
                  _id={typeFood._id}
                />
              );
            })}
          </Slider>
        )}

        <div className="button-filter button-next">
          <div onClick={next} className="arrow-right-food arrow-food"></div>
        </div>
      </div>
    </>
  );
};

export default Filter;
