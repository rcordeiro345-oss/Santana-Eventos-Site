import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Armchair,
  Building2,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Clock3,
  House,
  Menu,
  MapPin,
  MessageCircle,
  Phone,
  Table2,
  UsersRound,
  Wind,
  X,
} from 'lucide-react'
import './App.css'

type ImagemEspaco = {
  id: string
  alt: string
  src?: string
}

const imagensGaleria: ImagemEspaco[] = [
  {
    id: 'casamento-corredor',
    alt: 'Corredor decorado para cerimônia de casamento no Santana Eventos',
    src: '/fotos/galeria/01-casamento-corredor.webp',
  },
  {
    id: 'casamento-cerimonia',
    alt: 'Salão preparado para cerimônia de casamento',
    src: '/fotos/galeria/02-casamento-cerimonia.webp',
  },
  {
    id: 'casamento-mesa-principal',
    alt: 'Mesa principal decorada para casamento',
    src: '/fotos/galeria/03-casamento-mesa-principal.webp',
  },
  {
    id: 'casamento-salao-montado',
    alt: 'Salão montado com mesas e cadeiras para casamento',
    src: '/fotos/galeria/04-casamento-salao-montado.webp',
  },
  {
    id: 'casamento-decoracao',
    alt: 'Decoração de casamento no Santana Eventos',
    src: '/fotos/galeria/05-casamento-decoracao.webp',
  },
  {
    id: 'casamento-flores',
    alt: 'Detalhes florais de decoração de casamento',
    src: '/fotos/galeria/06-casamento-flores.webp',
  },
  {
    id: 'infantil-salao',
    alt: 'Salão decorado para festa infantil',
    src: '/fotos/galeria/07-infantil-salao-decorado.webp',
  },
  {
    id: 'infantil-ampla',
    alt: 'Vista ampla do espaço preparado para festa infantil',
    src: '/fotos/galeria/08-infantil-visao-ampla.webp',
  },
  {
    id: 'infantil-decoracao',
    alt: 'Decoração temática de festa infantil',
    src: '/fotos/galeria/09-infantil-decoracao.webp',
  },
  {
    id: 'infantil-detalhe',
    alt: 'Detalhes da mesa decorada para festa infantil',
    src: '/fotos/galeria/10-infantil-detalhe-mesa.webp',
  },
  {
    id: 'infantil-brinquedos',
    alt: 'Área preparada com brinquedos para festa infantil',
    src: '/fotos/galeria/11-infantil-area-brinquedos.webp',
  },
  {
    id: 'quinze-anos-decoracao',
    alt: 'Decoração de festa de 15 anos no Santana Eventos',
    src: '/fotos/galeria/12-15-anos-decoracao.webp',
  },
  {
    id: 'quinze-anos-ambiente',
    alt: 'Ambiente preparado para festa de 15 anos',
    src: '/fotos/galeria/13-15-anos-ambiente.webp',
  },
  {
    id: 'quinze-anos-doces',
    alt: 'Mesa de doces preparada para festa de 15 anos',
    src: '/fotos/galeria/14-15-anos-doces.webp',
  },
  {
    id: 'formatura-mesa',
    alt: 'Mesa decorada para festa de formatura',
    src: '/fotos/galeria/15-formatura-mesa.webp',
  },
  {
    id: 'formatura-decoracao',
    alt: 'Decoração temática de festa de formatura',
    src: '/fotos/galeria/17-formatura-decoracao.webp',
  },
  {
    id: 'formatura-salao',
    alt: 'Salão Santana Eventos preparado para uma festa de formatura',
    src: '/fotos/galeria/18-formatura-salao.webp',
  },
]

const imagensHero = imagensGaleria

const linkWhatsApp = `https://wa.me/5577981198079?text=${encodeURIComponent('Olá! Gostaria de consultar a disponibilidade do Santana Eventos para realizar um evento.')}`
const linkInstagram = 'https://www.instagram.com/santanaeventoss/'
const endereco = 'Rua Ulisses do Prado Nogueira, 927 A, Bairro Morada dos Pássaros – Felícia'
const linkEndereco = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
const avancarIndice = (indice: number, direcao: number, total: number) =>
  (indice + direcao + total) % total

const itensInclusos = [
  { icone: Building2, titulo: 'Salão de eventos', detalhe: 'Espaço amplo e versátil' },
  { icone: Table2, titulo: 'Mesas', detalhe: '12 mesas disponíveis' },
  { icone: Armchair, titulo: 'Cadeiras', detalhe: '100 cadeiras disponíveis' },
  { icone: Table2, titulo: 'Tampões', detalhe: '12 tampões disponíveis' },
  { icone: UsersRound, titulo: 'Banheiros', detalhe: 'Masculino e feminino' },
  { icone: CookingPot, titulo: 'Cozinha ampla', detalhe: 'Freezer, fogão e tacho para fritura' },
  { icone: Wind, titulo: 'Ambiente arejado', detalhe: 'Muitas janelas com telas de proteção' },
  { icone: Camera, titulo: 'Segurança', detalhe: 'Câmeras de segurança' },
]

function RamoOliveira() {
  return <img className="ramo-oliveira" src="/folha-oliveira.svg" alt="" aria-hidden="true" />
}

function App() {
  const [fotoHero, setFotoHero] = useState(0)
  const [fotoLightbox, setFotoLightbox] = useState<number | null>(null)
  const [menuAberto, setMenuAberto] = useState(false)
  const [heroHover, setHeroHover] = useState(false)
  const [heroFoco, setHeroFoco] = useState(false)
  const [heroInteracao, setHeroInteracao] = useState(false)
  const [reducaoMovimento, setReducaoMovimento] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const heroPauseTimeout = useRef<number | null>(null)
  const heroTouchStart = useRef<number | null>(null)
  const fecharLightboxRef = useRef<HTMLButtonElement>(null)
  const botaoMenuRef = useRef<HTMLButtonElement>(null)

  const pausarHero = () => {
    setHeroInteracao(true)
    if (heroPauseTimeout.current !== null) window.clearTimeout(heroPauseTimeout.current)
    heroPauseTimeout.current = window.setTimeout(() => {
      setHeroInteracao(false)
      heroPauseTimeout.current = null
    }, 4500)
  }

  useEffect(() => {
    if (heroHover || heroFoco || heroInteracao || reducaoMovimento) return

    const intervalo = window.setInterval(() => {
      setFotoHero((atual) => avancarIndice(atual, 1, imagensHero.length))
    }, 5000)

    return () => window.clearInterval(intervalo)
  }, [heroHover, heroFoco, heroInteracao, reducaoMovimento])

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const atualizarPreferencia = () => setReducaoMovimento(consulta.matches)
    consulta.addEventListener('change', atualizarPreferencia)
    return () => consulta.removeEventListener('change', atualizarPreferencia)
  }, [])

  useEffect(() => {
    if (fotoLightbox === null) return

    const focoAnterior = document.activeElement as HTMLElement | null
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fecharLightboxRef.current?.focus()

    const tratarTecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFotoLightbox(null)
      if (event.key === 'ArrowLeft') setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, -1, imagensGaleria.length))
      if (event.key === 'ArrowRight') setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, 1, imagensGaleria.length))
      if (event.key === 'Tab') {
        const botoes = document.querySelectorAll<HTMLButtonElement>('.lightbox button:not([disabled])')
        const primeiroBotao = botoes.item(0)
        const ultimoBotao = botoes.item(botoes.length - 1)

        if (event.shiftKey && document.activeElement === primeiroBotao) {
          event.preventDefault()
          ultimoBotao.focus()
        } else if (!event.shiftKey && document.activeElement === ultimoBotao) {
          event.preventDefault()
          primeiroBotao.focus()
        }
      }
    }

    window.addEventListener('keydown', tratarTecla)
    return () => {
      window.removeEventListener('keydown', tratarTecla)
      document.body.style.overflow = overflowAnterior
      focoAnterior?.focus()
    }
  }, [fotoLightbox])

  useEffect(() => () => {
    if (heroPauseTimeout.current !== null) window.clearTimeout(heroPauseTimeout.current)
  }, [])

  const tratarFimSwipeHero = (xFinal: number) => {
    if (heroTouchStart.current === null) return
    const distancia = xFinal - heroTouchStart.current
    if (Math.abs(distancia) > 45) {
      pausarHero()
      setFotoHero((atual) => avancarIndice(atual, distancia < 0 ? 1 : -1, imagensHero.length))
    }
    heroTouchStart.current = null
  }

  const navegarMenu = () => setMenuAberto(false)

  useEffect(() => {
    if (!menuAberto) return

    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuAberto(false)
        botaoMenuRef.current?.focus()
      }
    }

    window.addEventListener('keydown', fecharComEscape)
    return () => window.removeEventListener('keydown', fecharComEscape)
  }, [menuAberto])

  return (
    <div className="site">
      <header className="cabecalho">
        <a className="marca" href="#inicio" aria-label="Santana Eventos, início" onClick={navegarMenu}>
          <RamoOliveira />
          <span className="nome-marca">
            <strong>SANTANA</strong>
            <small>EVENTOS</small>
          </span>
        </a>

        <button
          className="botao-menu"
          type="button"
          ref={botaoMenuRef}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav id="menu-principal" className={menuAberto ? 'menu-principal aberto' : 'menu-principal'} aria-label="Navegação principal">
          <a href="#inicio" onClick={navegarMenu}>Início</a>
          <a href="#espaco" onClick={navegarMenu}>O Espaço</a>
          <a href="#como-funciona" onClick={navegarMenu}>Como funciona</a>
          <a href="#contato" onClick={navegarMenu}>Contato</a>
        </nav>

        <a className="botao-whatsapp" href={linkWhatsApp} target="_blank" rel="noreferrer" aria-label="Falar conosco pelo WhatsApp">
          <MessageCircle aria-hidden="true" />
          <span>Falar conosco</span>
        </a>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="hero-texto">
            <p className="sobretitulo">SEU EVENTO EM UM ESPAÇO ESPECIAL</p>
            <h1>Locação de espaço para festas e eventos</h1>
            <p>Locação de espaço para festas e eventos.</p>
            <span className="etiqueta"><CalendarDays aria-hidden="true" /> Locação somente do espaço</span>
            <a className="botao-principal" href="#espaco">Conhecer o espaço</a>
          </div>

          <div
            className="hero-slider"
            role="region"
            aria-roledescription="carrossel"
            aria-label="Fotos reais de eventos realizados no Santana Eventos"
            onMouseEnter={() => setHeroHover(true)}
            onMouseLeave={() => setHeroHover(false)}
            onFocusCapture={() => setHeroFoco(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroFoco(false)
            }}
            onTouchStart={(event) => {
              heroTouchStart.current = event.changedTouches[0].clientX
              pausarHero()
            }}
            onTouchEnd={(event) => tratarFimSwipeHero(event.changedTouches[0].clientX)}
            onTouchCancel={() => { heroTouchStart.current = null }}
          >
            <div
              key={imagensHero[fotoHero].id}
              className={`foto-slider variante-${fotoHero}`}
              role="img"
              aria-label={imagensHero[fotoHero].alt}
            >
              {imagensHero[fotoHero].src ? (
                <img className="foto-real" src={imagensHero[fotoHero].src} alt={imagensHero[fotoHero].alt} fetchPriority="high" decoding="async" />
              ) : (
                <>
                  <Building2 aria-hidden="true" />
                  <span>Foto real do salão em breve</span>
                </>
              )}
            </div>
            <button
              className="controle-hero controle-hero-anterior"
              type="button"
              aria-label="Ver foto anterior"
              onClick={() => { pausarHero(); setFotoHero((atual) => avancarIndice(atual, -1, imagensHero.length)) }}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              className="controle-hero controle-hero-proximo"
              type="button"
              aria-label="Ver próxima foto"
              onClick={() => { pausarHero(); setFotoHero((atual) => avancarIndice(atual, 1, imagensHero.length)) }}
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <div className="pontos-hero" role="group" aria-label="Selecionar foto do destaque">
              {imagensHero.map((imagem, indice) => (
                <button
                  key={imagem.id}
                  type="button"
                  aria-label={`Ver foto ${indice + 1} do destaque`}
                  aria-pressed={fotoHero === indice}
                  className={fotoHero === indice ? 'ponto ativo' : 'ponto'}
                  onClick={() => { pausarHero(); setFotoHero(indice) }}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="informacoes" className="faixa-informacoes" aria-label="Informações do espaço">
          <div className="item-informacao">
            <UsersRound aria-hidden="true" />
            <span><strong>Capacidade:</strong><br />até 150 pessoas</span>
          </div>
          <div className="item-informacao">
            <MapPin aria-hidden="true" />
            <span><strong>Localização:</strong><br />Morada dos Pássaros – Felícia</span>
          </div>
          <div className="item-informacao">
            <House aria-hidden="true" />
            <span><strong>Somente locação</strong><br />do espaço</span>
          </div>
          <div className="item-informacao">
            <Clock3 aria-hidden="true" />
            <span><strong>Atendimento:</strong><br />09h às 18h</span>
          </div>
        </section>

        <section id="espaco" className="secao-o-espaco">
          <div className="texto-o-espaco">
            <div className="titulo-secao">
              <span>Santana Eventos</span>
              <h2>O Espaço</h2>
              <p>Locação somente do espaço para festas e eventos, com capacidade para até 150 pessoas.</p>
              <p>Entre em contato pelo WhatsApp para consultar a disponibilidade e obter informações sobre a locação.</p>
            </div>
          </div>
          <div className="localizacao-espaco">
            <h3>Localização / Como chegar</h3>
            <address>Rua Ulisses do Prado Nogueira, 927 A<br />Bairro Morada dos Pássaros — Felícia</address>
            <a className="link-mapa" href={linkEndereco} target="_blank" rel="noreferrer">
              Ver no mapa <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="incluso" className="secao-incluso">
          <div className="cabecalho-secao">
            <div className="titulo-secao">
              <h2>O que está incluso</h2>
              <p>Itens disponíveis no espaço para os eventos.</p>
            </div>
          </div>
          <div className="itens-inclusos">
            {itensInclusos.map(({ icone: Icone, titulo, detalhe }) => (
              <article className="item-incluso" key={titulo}>
                <span className="icone-incluso" aria-hidden="true"><Icone /></span>
                <h3>{titulo}</h3>
                <p>{detalhe}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="momentos" className="secao-momentos">
          <div className="titulo-secao">
            <span>Santana Eventos</span>
            <h2>Um espaço para diferentes momentos</h2>
          </div>
          <ul className="tipos-momentos">
            <li>Festas e eventos</li>
            <li>Locação somente do espaço</li>
            <li>Capacidade para até 150 pessoas</li>
          </ul>
        </section>

        <section id="como-funciona" className="secao-como-funciona">
          <div className="titulo-secao">
            <span>Planeje sua visita</span>
            <h2>Como funciona</h2>
          </div>
          <ol className="passos-locacao">
            <li>
              <span>01</span>
              <h3>Consulte a disponibilidade</h3>
              <p>Entre em contato pelo WhatsApp e informe a data do evento.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Informe os detalhes</h3>
              <p>Compartilhe a data e as informações do evento com a equipe.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Confirme as informações</h3>
              <p>Consulte disponibilidade e condições diretamente com a equipe.</p>
            </li>
          </ol>
        </section>

        <section id="perguntas-frequentes" className="secao-faq">
          <div className="titulo-secao">
            <span>Informações</span>
            <h2>Perguntas frequentes</h2>
          </div>
          <div className="lista-faq">
            <details>
              <summary>Qual a capacidade do espaço?</summary>
              <p>Até 150 pessoas.</p>
            </details>
            <details>
              <summary>A locação inclui buffet ou decoração?</summary>
              <p>Não. O Santana Eventos trabalha com locação somente do espaço.</p>
            </details>
            <details>
              <summary>Qual é o endereço?</summary>
              <p>{endereco}</p>
            </details>
            <details>
              <summary>Qual é o horário de atendimento?</summary>
              <p>Das 09h às 18h.</p>
            </details>
            <details>
              <summary>Como consultar a disponibilidade?</summary>
              <p>Entre em contato pelo WhatsApp.</p>
            </details>
          </div>
        </section>

        <section id="disponibilidade" className="faixa-disponibilidade">
          <RamoOliveira />
          <div className="texto-disponibilidade">
            <h2>Quer saber se sua data está disponível?</h2>
            <p>Conte para a gente a data do seu evento. Respondemos pelo WhatsApp.</p>
          </div>
          <div className="acao-disponibilidade">
            <a className="botao-disponibilidade" href={linkWhatsApp} target="_blank" rel="noreferrer">
              Consultar disponibilidade
              <ArrowRight aria-hidden="true" />
            </a>
            <span>Atendimento pelo WhatsApp</span>
          </div>
        </section>

        <section id="contato" className="secao-contato">
          <div className="cabecalho-contato">
            <h2>Fale conosco</h2>
            <p>Estamos à disposição para tirar suas dúvidas e agendar uma visita.</p>
          </div>
          <div className="grade-contato">
            <div className="contato-item contato-whatsapp contato-redes">
              <MessageCircle aria-hidden="true" />
              <div>
                <h3>WhatsApp e Instagram</h3>

                <span className="contato-canal">WhatsApp</span>
                <a className="contato-numero" href={linkWhatsApp} target="_blank" rel="noreferrer">(77) 9 8119-8079</a>
                <a className="contato-acao" href={linkWhatsApp} target="_blank" rel="noreferrer">Conversar <ArrowRight aria-hidden="true" /></a>

                <span className="contato-canal contato-canal-secundario">Instagram</span>
                <a
                  className="contato-numero contato-numero-secundario"
                  href={linkInstagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  @santanaeventoss
                </a>
                <a
                  className="contato-acao"
                  href={linkInstagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver Instagram <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="contato-item">
              <Phone aria-hidden="true" />
              <div>
                <h3>Telefone</h3>
                <a className="contato-numero" href="tel:+5577981198079">(77) 9 8119-8079</a>
                <a className="contato-acao" href="tel:+5577981198079">Ligar <ArrowRight aria-hidden="true" /></a>
              </div>
            </div>
            <div className="contato-item">
              <MapPin aria-hidden="true" />
              <address>
                <h3>Localização</h3>
                <a href={linkEndereco} target="_blank" rel="noreferrer">Rua Ulisses do Prado Nogueira, 927 A<br />Bairro Morada dos Pássaros – Felícia</a>
              </address>
            </div>
            <div className="contato-item">
              <Clock3 aria-hidden="true" />
              <div>
                <h3>Horário</h3>
                <p>09h às 18h</p>
              </div>
            </div>
          </div>
        </section>
        <div className="mapa-final">
          <iframe
            className="mapa-espaco"
            title="Mapa da localização do Santana Eventos"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </main>

      {fotoLightbox !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${fotoLightbox + 1} do espaço ampliada`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setFotoLightbox(null)
          }}
        >
          <button className="lightbox-fechar" type="button" aria-label="Fechar foto ampliada" ref={fecharLightboxRef} onClick={() => setFotoLightbox(null)}>
            <X aria-hidden="true" />
          </button>
          <button className="lightbox-controle lightbox-anterior" type="button" aria-label="Foto anterior" onClick={() => setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, -1, imagensGaleria.length))}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className={`lightbox-foto variante-${fotoLightbox}`} role="img" aria-label={imagensGaleria[fotoLightbox].alt}>
            {imagensGaleria[fotoLightbox].src ? (
              <img className="foto-real" src={imagensGaleria[fotoLightbox].src} alt={imagensGaleria[fotoLightbox].alt} decoding="async" />
            ) : (
              <>
                <Building2 aria-hidden="true" />
                <span>Foto real do salão em breve</span>
              </>
            )}
          </div>
          <button className="lightbox-controle lightbox-proxima" type="button" aria-label="Próxima foto" onClick={() => setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, 1, imagensGaleria.length))}>
            <ChevronRight aria-hidden="true" />
          </button>
          <span className="lightbox-contador">{fotoLightbox + 1} / {imagensGaleria.length}</span>
        </div>
      )}

      <footer className="rodape">
        <a className="marca marca-rodape" href="#inicio">
          <RamoOliveira />
          <span className="nome-marca"><strong>SANTANA</strong><small>EVENTOS</small></span>
        </a>
        <nav className="menu-rodape" aria-label="Navegação do rodapé">
          <a href="#inicio">Início</a>
          <a href="#espaco">O Espaço</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#contato">Contato</a>
        </nav>
        <span className="direitos-autorais">© Santana Eventos<br />Todos os direitos reservados.</span>
      </footer>
    </div>
  )
}

export default App