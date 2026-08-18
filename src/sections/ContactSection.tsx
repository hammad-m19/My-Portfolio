import React from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, MessageCircle } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hammadmahmood330@gmail.com',
    href: 'mailto:hammadmahmood330@gmail.com',
  },
  {
    icon: Github,
    label: 'Github',
    value: 'github.com/hammad-m19',
    href: 'https://github.com/hammad-m19',
  },
  {
    icon: Linkedin,
    label: 'Linkedin',
    value: 'linkedin.com/in/muhammad-hammad-mahmood',
    href: 'https://www.linkedin.com/in/muhammad-hammad-mahmood-a84664344/',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '03096699111',
    href: 'https://wa.me/923096699111',
  },
];

const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-20 sm:pt-28 md:pt-36 pb-10"
    >
      {/* Heading */}
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Get in touch
        </h2>
      </FadeIn>

      {/* Subtitle */}
      <FadeIn delay={0.1} y={20}>
        <p className="text-[#D7E2EA]/60 text-center uppercase tracking-[0.25em] font-light text-xs sm:text-sm mt-6 sm:mt-8">
          Pick whichever channel suits you
        </p>
      </FadeIn>

      {/* Contact Cards */}
      <div className="max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contacts.map((contact, i) => {
          const Icon = contact.icon;
          return (
            <FadeIn key={contact.label} delay={0.15 + i * 0.1} y={30}>
              <a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-[#D7E2EA]/15 bg-[#141414] p-5 sm:p-6 hover:border-[#D7E2EA]/30 transition-colors duration-300 group h-full"
              >
                {/* Top row: icon + arrow */}
                <div className="flex items-start justify-between mb-8 sm:mb-10">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1e1e1e] border border-[#D7E2EA]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#D7E2EA]" strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight
                    className="w-5 h-5 text-[#D7E2EA]/40 group-hover:text-[#D7E2EA] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Label */}
                <p className="text-[#D7E2EA]/50 text-[0.7rem] uppercase tracking-[0.2em] font-medium mb-1.5">
                  {contact.label}
                </p>

                {/* Value */}
                <p className="text-[#D7E2EA] text-sm font-medium break-all leading-relaxed">
                  {contact.value}
                </p>
              </a>
            </FadeIn>
          );
        })}
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto mt-16 sm:mt-20 md:mt-24 border-t border-[#D7E2EA]/10" />

      {/* Footer */}
      <div className="text-center mt-8 sm:mt-10 pb-4">
        <p className="text-[#D7E2EA]/40 text-xs uppercase tracking-[0.2em] font-light">
          © 2026 Hammad
        </p>
        <p className="text-[#D7E2EA]/30 text-[0.65rem] uppercase tracking-[0.25em] font-light mt-2">
          Designed &amp; built with care
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
