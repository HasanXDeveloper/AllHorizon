import { Link } from 'wouter'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
                {/* Glitch Effect Text or Large 404 */}
                <div className="relative mb-8">
                    <h1 className="text-9xl font-black text-neutral-200 dark:text-neutral-800 select-none">
                        404
                    </h1>
                    
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                    Страница не найдена
                </h2>

                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
                    Похоже, вы забрели в неизведанные земли. Этой страницы не существует или она была перемещена.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/">
                        <a className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                            <Home className="w-5 h-5" />
                            Вернуться домой
                        </a>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all hover:scale-105 active:scale-95"
                    >
                        Назад
                    </button>
                </div>
            </div>
        </div>
    )
}
