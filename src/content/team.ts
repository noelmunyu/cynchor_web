// OWNER-TODO: each co-founder must approve their bio text, photo and any links before launch.

export interface TeamMember {
  id: string;
  name: string;
  role: 'Co-founder';
  photoSlug: string;
  tagline: string;
  focusAreas: string[];
  shortBio: string;
  fullBio: string[];
  links?: { label: string; href: string }[];
}

export interface TeamContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  members: TeamMember[];
}

export const TEAM_CONTENT: TeamContent = {
  eyebrow: 'THE TEAM',
  title: 'Meet the co-founders',
  subtitle: 'The people behind Cynchor.',
  members: [
    {
      id: 'elijah-chimera-mangale',
      name: 'Elijah Chimera Mangale',
      role: 'Co-founder',
      photoSlug: 'elijah-chimera-mangale',
      tagline: "Architecting what lasts, breaking what doesn't.",
      focusAreas: ['Cloud security', 'DevSecOps', 'Penetration testing'],
      shortBio:
        'Nairobi-based cloud and cybersecurity engineer who bridges building resilient AWS infrastructure and testing it exactly as an attacker would.',
      fullBio: [
        'Elijah Chimera Mangale is a Nairobi-based cloud and cybersecurity engineer who bridges the gap between building resilient AWS infrastructure and rigorously testing it exactly as an attacker would.',
        'He works across a modern DevSecOps stack, including Terraform, Kubernetes and Python, with a strict, safety-first mindset, and develops secure architectures and bespoke security tools like Raisins that prioritize explicit authorization and evidence-backed findings.',
        'An AWS Community Builder and certified Cloud Practitioner with a foundational background in Economics and Finance, Elijah translates complex technical risks into clear business metrics around cost and compliance. He delivers transparent penetration tests and shares hands-on technical workflows on his YouTube channel, archxploit.',
        "His mission: architecting what lasts, breaking what doesn't, and earning trust in between.",
      ],
    },
    {
      id: 'caleb-kimutai',
      name: 'Caleb Kimutai',
      role: 'Co-founder',
      photoSlug: 'caleb-kimutai',
      tagline: 'Building People.',
      focusAreas: ['Digital security', 'Responsible AI', 'Leadership'],
      shortBio:
        'Cybersecurity professional and emerging leader focused on safer digital environments, responsible AI, and empowering people.',
      fullBio: [
        'Caleb Kimutai is a cybersecurity professional and emerging leader passionate about strengthening digital security, advancing responsible AI, and building systems that create meaningful impact.',
        'His work brings together technology, people, and leadership, with a focus on making digital environments safer, translating ideas into practical solutions, and creating opportunities for people to grow.',
        'Grounded in integrity, service, faith, and a commitment to excellence, he seeks to bridge technological innovation with human responsibility, strengthening institutions and contributing to a better future. At the heart of his work is one central focus: Building People.',
      ],
    },
    {
      id: 'munyu-noel-muriithi',
      name: 'Munyu Noel Muriithi',
      role: 'Co-founder',
      photoSlug: 'munyu-noel-muriithi',
      tagline: 'A hacker at heart, a defender by discipline.',
      focusAreas: ['Offensive security', 'Defensive security', 'Purple team'],
      shortBio:
        'Faith-driven tech enthusiast with a BSc in Computer Security and Forensics who applies a purple team mindset to strengthen defenses.',
      fullBio: [
        'Munyu Noel Muriithi is a faith-driven tech enthusiast who loves solving problems and getting working solutions into the market. He holds a BSc in Computer Security and Forensics from Kabarak University, where he built a strong foundation in both attacking and defending systems.',
        'That foundation shapes how he works today: he is a hacker at heart and a defender by discipline, applying offensive insight to strengthen defenses and defensive thinking to sharpen offense.',
        'Noel is the co-founder of Hub Yetu, a company tackling the growing challenge of e-waste management. He believes technology should serve people and the planet, and he builds with that conviction. Whether he is securing a system or running a business, his focus is the same: practical solutions that work in the real world.',
      ],
    },
  ],
};
