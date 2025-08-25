import jasper from "/src/assets/Jasper.png";
import "../index.css";

export default function Credit() {
  // contact cards
  const team = [
    {
      name: "Jasper Liu",
      school: "Cal Poly Pomona",
      bio: "I am a third year CS major at Cal Poly Pomona. My career interests are Machine Learning and Web Development. I have experience working with pytorch, NextJS, and FastAPI. In the free time, I enjoy playing board games with friends!",
      linkedin: "https://www.linkedin.com/in/jasper-liu-a47a9024b/",
      img: jasper,
    },
    {
      name: "Ronald Li",
      school: "San Jose State University",
      bio: "I am a Computer Science major at San Jose State University. I gained technical skills through internships, hackathons, and open source contributions. Always happy to connect with others in tech!",
      linkedin: "https://www.linkedin.com/in/ronaldliyh/",
      img: "https://via.placeholder.com/150", // placeholder
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <h2 className="text-[2.5rem] font-bold text-center mb-6 text-[#e3350d] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
        Meet The Team
      </h2>
      <div className="flex flex-col md:flex-row gap-10 justify-center">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-white/90 backdrop-blur-sm shadow-md rounded-xl p-6 flex-1 flex flex-col items-center text-center border-2 border-gray-200 hover:shadow-lg transition"
          >
            <img
              src={member.img}
              alt={`${member.name}`}
              className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-[#ffcc33]"
            />
            <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{member.school}</p>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {member.bio}
            </p>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0075be] font-semibold hover:underline"
            >
              LinkedIn Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
