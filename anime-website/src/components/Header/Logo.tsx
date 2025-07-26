interface LogoProps {
  onClick: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <img
      src="/images/CiriAni.PNG"
      alt="Logo"
      className="max-w-48 cursor-pointer"
      onClick={onClick}
    />
  );
};

export default Logo;
