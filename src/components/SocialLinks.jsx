import {
  FaTwitter,
  FaFacebookSquare,
  FaMedium,
  FaTelegramPlane,
  FaLinkedin,
  FaDiscord,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

function SocialLinks() {
  return (
    <>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://twitter.com/deelance_com"
        target="_blank"
        rel="noreferrer"
      >
        <FaTwitter />
      </a>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://www.facebook.com/profile.php?id=100087266006183"
        target="_blank"
        rel="noreferrer"
      >
        <FaFacebookSquare />
      </a>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://medium.com/@deeLance"
        target="_blank"
        rel="noreferrer"
      >
        <FaMedium />
      </a>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://t.me/deelance_com"
        target="_blank"
        rel="noreferrer"
      >
        <FaTelegramPlane />
      </a>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://www.linkedin.com/company/deelance"
        target="_blank"
        rel="noreferrer"
      >
        <FaLinkedin />
      </a>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://discord.gg/vhH3Sbt9NQ"
        target="_blank"
        rel="noreferrer"
      >
        <FaDiscord />
      </a>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://www.instagram.com/deelanceofficial/"
        target="_blank"
        rel="noreferrer"
      >
        <FaInstagram />
      </a>
      <a
        className="text-main-green text-[1.25em] transition-all duration-100 hover:text-white"
        href="https://www.youtube.com/channel/UCM7Nv8JQECFr5lF_hd8KgTA"
        target="_blank"
        rel="noreferrer"
      >
        <FaYoutube />
      </a>
    </>
  );
}

export default SocialLinks;
