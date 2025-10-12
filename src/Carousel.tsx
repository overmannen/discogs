import { LP, type LpType } from "./LP";

type CarouselProps = {
  lps: LpType[];
};

export const Carousel = ({ lps }: CarouselProps) => {
  const animationDuration = `${lps.length * 2.5}s`;

  return (
    <div className="carousel">
      <div
        className="group"
        style={
          { "--animation-duration": animationDuration } as React.CSSProperties
        }
      >
        {lps.map((lp, index) => (
          <LP
            key={`first-${index}`}
            title={lp.title}
            artist={lp.artist}
            releaseDate={lp.releaseDate}
            img={lp.img}
          ></LP>
        ))}
        {lps.map((lp, index) => (
          <LP
            key={`second-${index}`}
            title={lp.title}
            artist={lp.artist}
            releaseDate={lp.releaseDate}
            img={lp.img}
          ></LP>
        ))}
      </div>
    </div>
  );
};
