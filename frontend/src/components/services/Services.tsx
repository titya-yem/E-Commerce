import circleBird from "@/assets/svg/CircleBird.svg";
import circleCat from "@/assets/svg/CircleCat.svg";
import circleDog from "@/assets/svg/CircleDog.svg";
import circleFish from "@/assets/svg/CircleFish.svg";
import circleRabbit from "@/assets/svg/CircleRabbit.svg";
import { Container } from "@radix-ui/themes";
import ServicesCards from "./ServicesCard";

const Services = () => {
  return (
    <Container className="mt-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl lg:text-4xl mx-auto md:my-4 font-bold uppercase">
          Services
        </h1>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap gap-6 md:space-y-0">
        <ServicesCards image={circleDog} index={0} />
        <ServicesCards image={circleCat} index={1} />
        <ServicesCards image={circleRabbit} index={2} />
        <ServicesCards image={circleBird} index={3} />
        <ServicesCards image={circleFish} index={4} />
      </div>
    </Container>
  );
};

export default Services;