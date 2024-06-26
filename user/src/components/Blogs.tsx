import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useEffect, useState } from "react";
import { Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { def } from "../assets";

import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

export interface BlogData {
  title: string;
  role: string;
  blogTitle: string;
  content: string;
  author: string;
  date: string;
  img: string;
  id: string;
}

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    let gotBlogs: BlogData[] = [];
    const fetchDocuments = async () => {
      const querySnapshot = await getDocs(collection(db, "blogs"));

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date;
        let dateObject = "";

        if (date instanceof Timestamp) {
          dateObject = date.toDate().toString().slice(0, 21);
          // console.log("Date:", dateObject);
        } else {
          console.error("Invalid or missing date field:", date);
        }

        const b: BlogData = {
          title: doc?.data()?.title,
          date: dateObject?.slice(0, 16),
          img: doc?.data()?.img,
          id: doc?.id,
          role: doc?.data()?.role,
          blogTitle: doc?.data()?.blogTitle,
          content: doc?.data()?.content,
          author: doc?.data()?.author,
        };
        gotBlogs.push(b);
      });
      gotBlogs = gotBlogs?.length > 3 ? gotBlogs?.slice(0, 3) : gotBlogs;
      gotBlogs = window.innerWidth < 640 ? gotBlogs?.slice(0, 2) : gotBlogs;
      setBlogs(gotBlogs);
    };

    fetchDocuments();
  }, []);

  return (
    <div
      className={`flex w-full ${styles.padding} h-[480px] sm:h-[550px] flex flex-col`}
    >
      <motion.p
        variants={textVariant(0.3)}
        className={`${styles.sectionHeadText} h-[7%]`}
      >
        Blogs
      </motion.p>
      <div className="w-full h-[90%] flex justify-between items-center">
        {blogs?.map((item, index) => {
          return (
            <motion.div
              variants={textVariant(0.2 * index)}
              key={index}
              onClick={() => navigate("/blog", { state: { blog: item } })}
              className="w-[45%] sm:w-[31%] cursor-pointer h-[85%] p-2 rounded-3xl justify-between flex flex-col"
            >
              <div className="w-full relative h-[60%] sm:h-[75%] rounded-3xl">
                <img
                  src={item?.img || def}
                  alt="trending"
                  className="w-full h-full object-cover rounded-3xl"
                />
                <p className="bg-white px-2 py-1 absolute top-5 left-5 rounded-lg">
                  Trips
                </p>
              </div>
              <div className="flex justify-between px-1 sm:px-3">
                <p className="  flex items-center font-light text-[10px] sm:text-[13px] ml-3">
                  {item?.date}
                </p>
                <p className=" flex items-center font-light text-[10px] sm:text-[13px] ml-3">
                  By &nbsp; {item?.author}
                </p>
              </div>
              <p className="h-auto sm:h-[15%] text-[12px] sm:text-[16px]  font-semibold flex items-center line-clamp-1">
                {item?.blogTitle}
              </p>
            </motion.div>
          );
        })}
      </div>
      <div className="w-full flex justify-end h-[8%]">
        <button
          onClick={() => navigate("/blogs")}
          className={`px-4 text-[13px] sm:text-[16px] py-1 sm:py-2 w-[30%] sm:w-[20%] rounded-3xl right-0 text-white font-semibold ${styles?.primaryBgColor}`}
        >
          More
        </button>
      </div>
    </div>
  );
};
export default SectionWrapper(Blogs);
