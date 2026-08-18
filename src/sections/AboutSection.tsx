import React from 'react';
import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';

const decorativeImages = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    alt: 'Moon icon',
    className: 'w-[120px] sm:w-[160px] md:w-[210px] absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    fadeProps: { delay: 0.1, x: -80, y: 0, duration: 0.9 },
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    alt: '3D object',
    className: 'w-[100px] sm:w-[140px] md:w-[180px] absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[4%]',
    fadeProps: { delay: 0.25, x: -80, y: 0, duration: 0.9 },
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    alt: 'Lego icon',
    className: 'w-[120px] sm:w-[160px] md:w-[210px] absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    fadeProps: { delay: 0.15, x: 80, y: 0, duration: 0.9 },
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    alt: '3D group',
    className: 'w-[130px] sm:w-[170px] md:w-[220px] absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    fadeProps: { delay: 0.3, x: 80, y: 0, duration: 0.9 },
  },
];

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center relative px-5 sm:px-8 md:px-10 py-20"
    >
      {/* Decorative images */}
      {decorativeImages.map((img, i) => (
        <FadeIn key={i} {...img.fadeProps} className={img.className}>
          <img src={img.src} alt={img.alt} className="w-full" />
        </FadeIn>
      ))}

      {/* Content */}
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 z-10">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text="I'm a Software Engineer who values craftsmanship over shortcuts. I build robust, scalable software with purpose and precision — from backend architecture to polished front-end experiences."
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[700px] mx-auto relative z-10"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />

          <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full max-w-3xl relative z-10">
            {[
              {
                category: 'Languages',
                items: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'SQL']
              },
              {
                category: 'Frameworks & Libraries',
                items: ['React', 'Next.js', 'Node.js', 'Express', 'Vue.js', 'Tailwind']
              },
              {
                category: 'Tools & Platforms',
                items: ['Git', 'Docker', 'AWS', 'Firebase', 'PostgreSQL', 'MongoDB', 'Vercel']
              }
            ].map((skillGroup, idx) => (
              <FadeIn key={skillGroup.category} delay={0.2 + idx * 0.1} y={20}>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6">
                  <span className="text-[#D7E2EA]/50 text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] font-medium w-[180px] text-center md:text-right pt-2 shrink-0">
                    {skillGroup.category}
                  </span>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-2.5">
                    {skillGroup.items.map(item => (
                      <span key={item} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#D7E2EA]/15 text-[#D7E2EA] text-[0.75rem] sm:text-xs hover:border-[#D7E2EA]/40 hover:bg-[#D7E2EA]/5 transition-colors cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
