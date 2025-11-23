import ServerStatus from './ServerStatus'
import ScrollAnimation from './ScrollAnimation'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800">
      <div className="container-width">
        <div className="py-16 px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="lg:col-span-1 space-y-6">
              <ScrollAnimation animation="animate-fadeInUp">
                <a href="/" className="flex items-center space-x-3 group">
                  <div className="relative">
                    <img
                      src="/images/logo.png"
                      alt="Horizon"
                      width="48"
                      height="48"
                      className="rounded-xl group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">Horizon</span>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Minecraft Server</p>
                  </div>
                </a>

                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-6">
                  Дружное сообщество игроков Minecraft, создающее уютное место для творчества и общения без лишних модификаций и донатов.
                </p>

                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mt-6">
                  <i className="fas fa-heart h-4 w-4 text-red-500"></i>
                  <span>Создано с любовью для игроков</span>
                </div>
              </ScrollAnimation>
            </div>

            {/* Links */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <ScrollAnimation animation="animate-fadeInUp" delay={100} className="h-full">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">Сервер</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
                        Главная
                      </a>
                    </li>
                    <li>
                      <a href="/rules" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
                        Правила
                      </a>
                    </li>
                    <li>
                      <a href="/wiki/about" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
                        Вики
                      </a>
                    </li>
                    <li>
                      <a href="/bank" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
                        Банк
                      </a>
                    </li>
                    <li>
                      <a href="/social" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
                        Сообщество
                      </a>
                    </li>
                  </ul>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="animate-fadeInUp" delay={200} className="h-full">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">Сообщество</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="https://discord.com/invite/vSPKYsUnyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
                        Discord
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://t.me/horizonmc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
                        Telegram
                      </a>
                    </li>
                  </ul>
                </div>
              </ScrollAnimation>
            </div>

            {/* Server Info Card with Status */}
            <div className="lg:col-span-1 ">
              <ScrollAnimation animation="animate-fadeInUp" delay={300}>
                <div className="rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6">
                  <h3 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
                    Информация о сервере
                  </h3>
                  <ServerStatus serverIP="horizonserver.space" compact={true} />
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 ">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-600 dark:text-neutral-300">IP адрес</span>
                      <span className="font-mono text-neutral-900 dark:text-white">horizonserver.space</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-600 dark:text-neutral-300">Версия</span>
                      <span className="text-neutral-900 dark:text-white">1.21.4+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-300">Режим работы</span>
                      <span className="text-neutral-900 dark:text-white">24/7</span>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 py-8 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                © {currentYear} Horizon Server. Все права защищены.
              </p>
              <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
                NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
              </p>
            </div>
            <div className="text-center md:text-right">

              <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
                С любовью для сообщества Horizon
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
