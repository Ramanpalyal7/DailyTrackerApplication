"use client";
import { useState } from "react";
import { faqItems } from "@/data/faq";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";
export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container ">
        {/* ------   header -------- */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Frquently Asked Questions
        </h2>
        {/* --------   Answers Display -------- */}
        <div className="max-w-2xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            // <div key={index} className="border rounded-lg p-4">
            <motion.div
              key={index}
              layout
              className="overflow-hidden rounded-lg border p-4"
              transition={{
                layout: {
                  duration: 0.45,
                  ease: "easeInOut",
                },
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left font-medium gap-5 p-4 transition-colors hover:bg-gradient-to-b   from-[#f5fdff] to-[#e0fcff] rounded"
              >
                {item.question}
                <motion.span
                  animate={{
                    rotate: openIndex === index ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <span>
                    {openIndex === index ? (
                      <IoIosArrowDown />
                    ) : (
                      <IoIosArrowUp />
                    )}
                  </span>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                      },
                      opacity: {
                        duration: 0.2,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-gray-600">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
