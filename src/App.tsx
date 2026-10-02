import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Armchair,
  Building2,
  CalendarDays,
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

const imagensEspaco: ImagemEspaco[] = [
  {
    id: 'foto-salao-1',
    alt: 'Foto real do salão',
  },
  {
    id: 'foto-salao-2',
    alt: 'Foto real do salão',
  },
  {
    id: 'foto-salao-3',
    alt: 'Foto real do salão',
  },
  {
    id: 'foto-salao-4',
    alt: 'Foto real do salão',
  },
]

const linkWhatsApp = `https://wa.me/5577981198079?text=${encodeURIComponent('Olá! Gostaria de consultar a disponibilidade do Santana Eventos para realizar um evento.')}`
const endereco = 'Rua Ulisses do Prado Nogueira, 927 A, Bairro Morada dos Pássaros – Felícia'
const linkEndereco = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
const avancarIndice = (indice: number, direcao: number) =>
  (indice + direcao + imagensEspaco.length) % imagensEspaco.length

const itensInclusos = [
  { icone: Building2, titulo: 'Salão de eventos', detalhe: 'Espaço amplo e versátil' },
  { icone: Table2, titulo: 'Mesas', detalhe: 'Disponíveis para os eventos' },
  { icone: Armchair, titulo: 'Cadeiras', detalhe: 'Disponíveis para os convidados' },
  { icone: UsersRound, titulo: 'Banheiros', detalhe: 'Masculino e feminino' },
  { icone: CookingPot, titulo: 'Cozinha de apoio', detalhe: 'Disponível para apoio durante o evento' },
  { icone: Wind, titulo: 'Climatização', detalhe: 'Ambiente ventilado e confortável' },
]

function RamoOliveira() {
  return <img className="ramo-oliveira" src="/folha-oliveira.svg" alt="" aria-hidden="true" />
}

function App() {
  const [fotoHero, setFotoHero] = useState(0)
  const [fotoGaleria, setFotoGaleria] = useState(0)
  const [fotoLightbox, setFotoLightbox] = useState<number | null>(null)
  const [menuAberto, setMenuAberto] = useState(false)
  const [heroHover, setHeroHover] = useState(false)
  const [heroFoco, setHeroFoco] = useState(false)
  const [heroInteracao, setHeroInteracao] = useState(false)
  const [reducaoMovimento, setReducaoMovimento] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [galeriaVisivel, setGaleriaVisivel] = useState(() => {
    if (typeof window === 'undefined') return 4
    if (window.innerWidth <= 560) return 1
    if (window.innerWidth <= 900) return 2
    if (window.innerWidth <= 1100) return 3
    return 4
  })
  const heroPauseTimeout = useRef<number | null>(null)
  const heroTouchStart = useRef<number | null>(null)
  const galleryTouchStart = useRef<number | null>(null)
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

  const fotosVisiveis = Array.from({ length: galeriaVisivel }, (_, posicao) => {
    const indice = (fotoGaleria + posicao) % imagensEspaco.length
    return { ...imagensEspaco[indice], indice }
  })

  useEffect(() => {
    if (heroHover || heroFoco || heroInteracao || reducaoMovimento) return

    const intervalo = window.setInterval(() => {
      setFotoHero((atual) => avancarIndice(atual, 1))
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
    const atualizarQuantidadeFotos = () => {
      const largura = window.innerWidth
      setGaleriaVisivel(largura <= 560 ? 1 : largura <= 900 ? 2 : largura <= 1100 ? 3 : 4)
    }

    window.addEventListener('resize', atualizarQuantidadeFotos)
    return () => window.removeEventListener('resize', atualizarQuantidadeFotos)
  }, [])

  useEffect(() => {
    if (fotoLightbox === null) return

    const focoAnterior = document.activeElement as HTMLElement | null
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fecharLightboxRef.current?.focus()

    const tratarTecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFotoLightbox(null)
      if (event.key === 'ArrowLeft') setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, -1))
      if (event.key === 'ArrowRight') setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, 1))
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
      setFotoHero((atual) => avancarIndice(atual, distancia < 0 ? 1 : -1))
    }
    heroTouchStart.current = null
  }

  const tratarFimSwipeGaleria = (xFinal: number) => {
    if (galleryTouchStart.current === null) return
    const distancia = xFinal - galleryTouchStart.current
    if (Math.abs(distancia) > 45) {
      setFotoGaleria((atual) => avancarIndice(atual, distancia < 0 ? 1 : -1))
    }
    galleryTouchStart.current = null
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
          <a href="#galeria" onClick={navegarMenu}>Galeria</a>
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
            aria-label="Espaços reservados para fotos reais do salão"
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
              key={imagensEspaco[fotoHero].id}
              className={`foto-slider variante-${fotoHero}`}
              role="img"
              aria-label={imagensEspaco[fotoHero].alt}
            >
              {imagensEspaco[fotoHero].src ? (
                <img className="foto-real" src={imagensEspaco[fotoHero].src} alt={imagensEspaco[fotoHero].alt} fetchPriority="high" decoding="async" />
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
              onClick={() => { pausarHero(); setFotoHero((atual) => avancarIndice(atual, -1)) }}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              className="controle-hero controle-hero-proximo"
              type="button"
              aria-label="Ver próxima foto"
              onClick={() => { pausarHero(); setFotoHero((atual) => avancarIndice(atual, 1)) }}
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <div className="pontos-hero" role="group" aria-label="Selecionar foto do destaque">
              {imagensEspaco.map((imagem, indice) => (
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

        <section id="galeria" className="secao-galeria">
          <div className="cabecalho-secao cabecalho-galeria">
            <div className="titulo-secao">
              <h2>Veja o espaço</h2>
              <p>Fotos reais do espaço estarão disponíveis em breve.</p>
            </div>
            <div className="controles-galeria">
              <button type="button" aria-label="Ver fotos anteriores" onClick={() => setFotoGaleria((atual) => avancarIndice(atual, -1))}>
                <ChevronLeft aria-hidden="true" />
              </button>
              <button type="button" aria-label="Ver próximas fotos" onClick={() => setFotoGaleria((atual) => avancarIndice(atual, 1))}>
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className="galeria-slider"
            role="region"
            aria-roledescription="carrossel"
            aria-label="Galeria de fotos do espaço"
            onTouchStart={(event) => { galleryTouchStart.current = event.changedTouches[0].clientX }}
            onTouchEnd={(event) => tratarFimSwipeGaleria(event.changedTouches[0].clientX)}
            onTouchCancel={() => { galleryTouchStart.current = null }}
          >
            <div className="fotos-galeria">
              {fotosVisiveis.map((imagem) => (
                <button
                  className={`foto-galeria variante-${imagem.indice}`}
                  type="button"
                  aria-label={`Ampliar foto ${imagem.indice + 1} do espaço`}
                  key={imagem.id}
                  onClick={() => setFotoLightbox(imagem.indice)}
                >
                  {imagem.src ? (
                    <img className="foto-real" src={imagem.src} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <>
                      <Building2 aria-hidden="true" />
                      <span>Foto real do salão em breve</span>
                    </>
                  )}
                </button>
              ))}
            </div>
            <div className="pontos-galeria" role="group" aria-label="Selecionar posição da galeria">
              {imagensEspaco.map((imagem, indice) => (
                <button
                  key={imagem.id}
                  type="button"
                  aria-label={`Mostrar carrossel a partir da foto ${indice + 1}`}
                  aria-pressed={fotoGaleria === indice}
                  className={fotoGaleria === indice ? 'ponto ativo' : 'ponto'}
                  onClick={() => setFotoGaleria(indice)}
                />
              ))}
            </div>
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
            <div className="contato-item contato-whatsapp">
              <MessageCircle aria-hidden="true" />
              <div>
                <h3>WhatsApp</h3>
                <a className="contato-numero" href={linkWhatsApp} target="_blank" rel="noreferrer">(77) 9 8119-8079</a>
                <a className="contato-acao" href={linkWhatsApp} target="_blank" rel="noreferrer">Conversar <ArrowRight aria-hidden="true" /></a>
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
          <button className="lightbox-controle lightbox-anterior" type="button" aria-label="Foto anterior" onClick={() => setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, -1))}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className={`lightbox-foto variante-${fotoLightbox}`} role="img" aria-label={imagensEspaco[fotoLightbox].alt}>
            {imagensEspaco[fotoLightbox].src ? (
              <img className="foto-real" src={imagensEspaco[fotoLightbox].src} alt={imagensEspaco[fotoLightbox].alt} decoding="async" />
            ) : (
              <>
                <Building2 aria-hidden="true" />
                <span>Foto real do salão em breve</span>
              </>
            )}
          </div>
          <button className="lightbox-controle lightbox-proxima" type="button" aria-label="Próxima foto" onClick={() => setFotoLightbox((atual) => atual === null ? null : avancarIndice(atual, 1))}>
            <ChevronRight aria-hidden="true" />
          </button>
          <span className="lightbox-contador">{fotoLightbox + 1} / {imagensEspaco.length}</span>
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
          <a href="#galeria">Galeria</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#contato">Contato</a>
        </nav>
        <span className="direitos-autorais">© Santana Eventos<br />Todos os direitos reservados.</span>
      </footer>
    </div>
  )
}

export default App