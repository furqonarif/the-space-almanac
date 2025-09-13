// Footer.jsx
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        {/* Author */}
        <p>
          © 2025{" "}
          <span className="footer-title">The Space Almanac</span> | Author:{" "}
          <a
            href="https://furqonarif.github.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Furqon Arif
          </a>
        </p>

        {/* Social Icons */}
        <div className="social-links">
          <a
            href="https://github.com/furqonarif"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={22} />
          </a>
          <a
            href="https://linkedin.com/in/arif-furqonn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={22} />
          </a>
          <a
            href="https://x.com/ariffurqonn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}