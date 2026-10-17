import { PHOTO_ASSETS } from '../data/restaurantData';

export function StoryAndCraftSection() {
  return (
    <section 
      id="our-story-and-wok-hei" 
      className="mt-8 sm:mt-space-3xl rounded-2xl p-4 sm:p-space-lg md:p-space-2xl lg:p-12 xl:p-16 bg-surface-container-low border border-surface-container-high/60 shadow-xl overflow-hidden w-full max-w-full min-w-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-gutter xl:gap-14 items-center">
        {/* Left Column: Narrative & Metrics */}
        <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-space-md">
          <div>
            <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
              The craft behind the wok
            </span>
            <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5">Fire, Wok, Repeat</h2>
          </div>

          <p className="font-body-lg text-xs sm:text-sm md:text-base lg:text-body-lg text-tertiary leading-relaxed">
            We have been feeding Keong Saik Road since 1968. In an era of induction cooktops and central commissaries, we still cook the way Cantonese zi char was meant to be cooked: over high-pressure gas jets, in cast-iron woks seasoned by decades of smoke.
          </p>

          <p className="font-body-md text-xs sm:text-sm text-tertiary leading-relaxed">
            Wok hei is not smoke alone. It is the caramelisation of juices thrown against screaming metal at over 300°C, pulled back at the exact second before char turns to bitterness. You taste it in the char of our hor fun, the crisp skin of our prawn paste chicken, and the breath of the claypot when the lid is lifted at your table.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-gutter pt-3 sm:pt-space-md border-t border-surface-container-high/60">
            <div className="flex flex-col">
              <span className="font-display-hero text-xl sm:text-2xl md:text-headline-lg lg:text-headline-xl text-primary font-bold">1968</span>
              <span className="font-body-sm text-[11px] sm:text-xs md:text-body-sm text-tertiary leading-tight mt-0.5">Founded on Keong Saik Road</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display-hero text-xl sm:text-2xl md:text-headline-lg lg:text-headline-xl text-primary font-bold">3rd Gen</span>
              <span className="font-body-sm text-[11px] sm:text-xs md:text-body-sm text-tertiary leading-tight mt-0.5">Kitchen craft handed down</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display-hero text-xl sm:text-2xl md:text-headline-lg lg:text-headline-xl text-primary font-bold">100%</span>
              <span className="font-body-sm text-[11px] sm:text-xs md:text-body-sm text-tertiary leading-tight mt-0.5">Fired to order on woks</span>
            </div>
          </div>
        </div>

        {/* Right Column: High Flame Action Photo & Heritage Atmosphere Accents */}
        <div className="lg:col-span-6 flex flex-col gap-2.5 sm:gap-3 mt-2 lg:mt-0">
          <div className="aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-surface-container border border-surface-container-high group">
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              alt="Action photo of Chinese chef tossing flat rice noodles and king prawns over roaring high flame inside Kok Sen wok kitchen with flying embers" 
              src={PHOTO_ASSETS.wokFlame}
              loading="lazy"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-surface-container border border-surface-container-high/80 relative group shadow-md">
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Neon illuminated Cantonese dish name wooden partition wall inside Kok Sen"
                src={PHOTO_ASSETS.neonSigns}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-2 sm:p-2.5">
                <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide">Neon Calligraphy</span>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-surface-container border border-surface-container-high/80 relative group shadow-md">
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Framed Singapore shophouse folk art gallery wall inside Kok Sen"
                src={PHOTO_ASSETS.artWall}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-2 sm:p-2.5">
                <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide">Keong Saik Art Wall</span>
              </div>
            </div>
          </div>
          <div className="mt-0.5 text-right">
            <span className="font-body-sm text-[11px] sm:text-xs text-tertiary italic">
              From the roaring wok station to the heritage Keong Saik dining room
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
