import React, { useState, useEffect } from 'react';
// ¡Actualizado!: Se agregaron iconos nuevos para el portal
import { Menu, X, Phone, Mail, MapPin, ChevronDown, CheckCircle, FileText, XCircle, HardHat, Zap, Wrench, Sprout, ArrowRight } from 'lucide-react';

// --- IMPORTACIÓN DE IMÁGENES ---
// ¡Importante!: Dejé las importaciones originales.
// Necesitarás una foto de construcción nueva para el portal o usar un color sólido.
import heroBg from './assets/fondo-rocas.avif';
import imgSacos from './assets/carbonato-sacos.jpg';
import imgCalcium from './assets/Calcium_carbonate.jpg';
import imgPolvoBlanco from './assets/polvo-blanco.jpg';
import imgGrafito from './assets/grafito.jpg';
import imgTalco from './assets/talco-manos.jpg';
import imgMina from './assets/mina-camion.jpg';
import logoImg from './assets/perfil.jpg'; 
import imgKraft from './assets/sacos-kraft.jpg';
import imgBaritaBeige from './assets/barita_beige.png';

import imgInicioConstruccion from './assets/inicio.jpg';
import imgRemodelacion from './assets/remodelacion.jpeg';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false); 
  
  // ¡EL CORAZÓN DEL PORTAL!
  // null = muestra el portal (split screen)
  // 'industrial' = muestra la web de minerales
  // 'construccion' = muestra la web de obras
  const [vistaActiva, setVistaActiva] = useState(null); 

  // Estado para la animación del Portal (cuál lado está expandido en hover/tap)
  const [expandedSide, setExpandedSide] = useState(null); // 'left' o 'right'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollTo = (id) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
    division: vistaActiva // Esto capturará automáticamente si es 'industrial' o 'construccion'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Invocamos a reCAPTCHA para obtener el token invisible
    window.grecaptcha.ready(function() {
      window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {action: 'submit'}).then(async function(token) {
        
        // Armamos el paquete de datos
        const datosAEnviar = {
          nombre: formData.nombre,
          email: formData.email,
          mensaje: formData.mensaje,
          division: vistaActiva === 'industrial' ? 'INDUSTRIAL' : 'CONSTRUCCIÓN Y OBRAS',
          recaptchaToken: token  // El escudo anti-spam
        };

        try {
          // URL del Google Apps Script que recibe el formulario (definida en .env.local)
          const GOOGLE_SCRIPT_URL = import.meta.env.VITE_FORM_ENDPOINT;

          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(datosAEnviar),
            headers: { "Content-Type": "text/plain" } // Usamos text/plain para evitar bloqueos de CORS
          });

          const result = await response.json();

          if (result.status === 'success' || result.result === 'success') {
            setIsSuccess(true);
            // Limpiar el formulario
            setFormData({ nombre: '', email: '', mensaje: '', division: vistaActiva });
          } else {
            alert('Hubo un error al enviar el mensaje. Inténtelo más tarde.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Hubo un problema de conexión.');
        } finally {
          setIsSubmitting(false);
        }

      }).catch(error => {
        console.error('Error de reCAPTCHA:', error);
        alert('Hubo un problema al validar el reCAPTCHA.');
        setIsSubmitting(false);
      });
    });
  };

  const entrarADivision = (division) => {
    setVistaActiva(division);
    setIsSuccess(false);
    window.scrollTo(0, 0);
  };

  const volverAlPortal = () => {
    setVistaActiva(null);
    setIsSuccess(false);
    window.scrollTo(0, 0);
  };

  // --- CONFIGURACIÓN DE LOS RECORTES DIAGONALES (clip-path) ---
  // Estos porcentajes logran la diagonal "ligera" de tu dibujo.
  const getClipPaths = () => {
    if (isMobile) {
      // Corte horizontal para móviles (mitad arriba, mitad abajo con un ligero ángulo)
      return {
        left: `polygon(0 0, 100% 0, 100% 48%, 0 52%)`,
        right: `polygon(0 52%, 100% 48%, 100% 100%, 0 100%)`
      };
    }

    // Offset diagonal (la diferencia entre arriba y abajo para crear la inclinación)
    const offset = 20; 
    
    // Puntos base para el split (aprox 60% izquierda, 40% derecha en el medio)
    let leftSplitTop = 60;
    let rightSplitTop = 60;

    if (expandedSide === 'left') {
      leftSplitTop = 95; // Se expande casi por completo
      rightSplitTop = 95;
    } else if (expandedSide === 'right') {
      leftSplitTop = 5; // Se colapsa casi por completo
      rightSplitTop = 5;
    }

    // Calculamos los puntos de abajo restando el offset para crear la diagonal
    const leftSplitBottom = leftSplitTop - offset;
    const rightSplitBottom = rightSplitTop - offset;

    return {
      // clip-path: polygon(arriba-izq, arriba-der, abajo-der, abajo-izq)
      left: `polygon(0 0, ${leftSplitTop}% 0, ${leftSplitBottom}% 100%, 0 100%)`,
      right: `polygon(${rightSplitTop}% 0, 100% 0, 100% 100%, ${rightSplitBottom}% 100%)`
    };
  };

  const clips = getClipPaths();

  return (
    <div className="font-sans text-slate-800 bg-white relative min-h-screen">
      
      {/* --- MODAL TÉRMINOS Y CONDICIONES --- */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-ekos-green" /> Términos y Condiciones Legales
              </h3>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-red-500 transition">
                <XCircle size={28} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto text-sm text-gray-600 space-y-4 leading-relaxed text-justify pr-4">
              <p><strong>1. INFORMACIÓN GENERAL:</strong> En cumplimiento del Reglamento de Comercio Electrónico, se informa que este sitio web es administrado por <strong>EKOS PACK SPA</strong>. La empresa opera en dos divisiones: Suministro de materias primas industriales y Obras menores de construcción con certificación SEC.</p>
              <p><strong>2. PROCESO DE COTIZACIÓN Y CONTRATACIÓN:</strong> Todas las cotizaciones de materias primas y los presupuestos de obras menores están sujetos a confirmación de stock, viabilidad técnica, visita a terreno (en caso de obras) y variaciones de precio del mercado. El servicio se perfecciona únicamente tras la emisión de un presupuesto formal y confirmación escrita del cliente.</p>
              <p><strong>3. NORMATIVA SEC:</strong> En cumplimiento de la ley chilena, todos los trabajos de índole eléctrica ofrecidos en la División Obras Menores son realizados exclusivamente por profesionales autorizados y certificados por la Superintendencia de Electricidad y Combustibles (SEC).</p>
              <p className="text-xs text-gray-400 mt-4 border-t pt-4">Vigencia: Desde Febrero 2026. Santiago de Chile.</p>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
              <button onClick={() => setShowTerms(false)} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================= PANTALLA PORTAL DE ENTRADA (Split) ============= */}
      {/* ========================================================================= */}
      
      {vistaActiva === null && (
        <main className="fixed inset-0 z-[80] bg-white flex flex-col md:flex-row overflow-hidden animate-fade-in">
          
          {/* LOGO FLOTANTE UNIVERSAL */}
          <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-[90] bg-white p-3 md:p-4 rounded-xl shadow-2xl border border-gray-100 flex items-center justify-center">
             <img src={logoImg} alt="Ekos Pack" className="h-10 md:h-20 w-auto object-contain" />
          </div>

          {/* ----- LADO IZQUIERDO: INDUSTRIAL ----- */}
          <div 
            className="absolute inset-0 z-10 bg-slate-100 transition-all duration-700 ease-in-out cursor-pointer group flex items-start md:items-center justify-center pt-24 md:pt-0 p-6 md:p-12"
            style={{ clipPath: clips.left }}
            onMouseEnter={() => !isMobile && setExpandedSide('left')}
            onMouseLeave={() => !isMobile && setExpandedSide(null)}
            onClick={() => {
              // Toque directo en móviles (0 falsos clicks)
              if (isMobile || expandedSide === 'left') {
                entrarADivision('industrial');
              } else {
                setExpandedSide('left'); // En PC, el primer clic expande
              }
            }}
          >
             {/* Imagen de Fondo */}
             <img src={imgMina} alt="División Industrial" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-60" />
             {/* Overlay de color */}
             <div className="absolute inset-0 bg-gradient-to-r from-ekos-green/90 to-green-950/90 transition-opacity duration-700 opacity-100 group-hover:opacity-90"></div>

             {/* Contenido (Se mantiene centrado gracias al padding-right condicional si quieres) */}
             <div className={`relative z-20 mt-0 md:mt-24 text-center text-white transition-all duration-700 flex flex-col items-center max-w-xs md:max-w-lg ${!isMobile && expandedSide === 'right' ? 'opacity-0 scale-90' : 'opacity-100'}`}>
                <Sprout size={isMobile ? 40 : 64} className="mb-2 md:mb-6 text-green-200" />
                <h2 className="text-3xl md:text-6xl font-extrabold mb-2 md:mb-4 tracking-tight drop-shadow-md">División <br/> Industrial</h2>
                <p className="text-sm md:text-xl text-green-100 mb-6 md:mb-10 font-light leading-relaxed">
                  <span className="hidden md:inline">Materias Primas de Alta Pureza: Carbonato de Calcio, Talco, Grafito y Caolín.</span>
                  <span className="inline md:hidden">Materias Primas de Alta Pureza</span>
                </p>
                
                {/* Botón (Solo visible si está expandido en PC o siempre en móvil) */}
                <button className={`flex items-center gap-2 md:gap-3 bg-white text-ekos-green px-6 py-2 md:px-10 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-green-50 transition shadow-2xl ${!isMobile && expandedSide !== 'left' ? 'md:opacity-0' : 'opacity-100'}`}>
                   Ver Materias Primas <ArrowRight size={isMobile ? 18 : 24}/>
                </button>
             </div>
          </div>

          {/* ----- LADO DERECHO: CONSTRUCCIÓN ----- */}
          <div 
            className="absolute inset-0 z-20 bg-slate-800 transition-all duration-700 ease-in-out cursor-pointer group flex items-end md:items-center justify-center pb-20 md:pb-0 p-6 md:p-12"
            style={{ clipPath: clips.right }}
            onMouseEnter={() => !isMobile && setExpandedSide('right')}
            onMouseLeave={() => !isMobile && setExpandedSide(null)}
            onClick={() => {
              if (isMobile || expandedSide === 'right') {
                entrarADivision('construccion');
              } else {
                setExpandedSide('right'); // En PC, el primer clic expande
              }
            }}
          >
             {/* Imagen de Fondo */}
             <img src={imgInicioConstruccion} alt="División Construcción" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-70" />
             {/* Overlay de color */}
             <div className="absolute inset-0 bg-gradient-to-l from-amber-700/80 to-amber-950/90 transition-opacity duration-700 opacity-100 group-hover:opacity-90"></div>

             {/* Contenido */}
             <div className={`relative z-20 mt-0 md:mt-24 text-center text-white transition-all duration-700 flex flex-col items-center max-w-xs md:max-w-lg ${!isMobile && expandedSide === 'left' ? 'opacity-0 scale-90' : 'opacity-100'}`}>
                <HardHat size={isMobile ? 40 : 64} className="mb-2 md:mb-6 text-amber-200" />
                <h2 className="text-3xl md:text-6xl font-extrabold mb-2 md:mb-4 tracking-tight drop-shadow-md">Obras y <br/> Remodelaciones</h2>
                <p className="text-sm md:text-xl text-amber-100 mb-6 md:mb-10 font-light leading-relaxed">
                  <span className="hidden md:inline">Especialistas en Obras Menores Domiciliarias e Instalaciones Eléctricas Autorizadas SEC.</span>
                  <span className="inline md:hidden">Obras Domiciliarias e Instalaciones SEC</span>
                </p>
                
                {/* Botón */}
                <button className={`flex items-center gap-2 md:gap-3 bg-white text-amber-600 px-6 py-2 md:px-10 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-amber-50 transition shadow-2xl ${!isMobile && expandedSide !== 'right' ? 'md:opacity-0' : 'opacity-100'}`}>
                   Ver Servicios <ArrowRight size={isMobile ? 18 : 24}/>
                </button>
             </div>
          </div>
          
          {/* Texto de ayuda inferior */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[90] text-center text-slate-800 font-medium text-xs px-6 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-xl hidden md:block border border-gray-200/50">
             Haga clic en una división para explorar sus servicios o productos.
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* ========================== SITIO INTERNO (Webs) ========================= */}
      {/* ========================================================================= */}
      
      {vistaActiva !== null && (
        <>
          {/* --- NAVBAR DINÁMICO --- */}
          <nav className="fixed w-full z-50 bg-white/95 backdrop-blur shadow-sm">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <img src={logoImg} alt="Ekos Pack" className="h-14 md:h-16 w-auto object-contain" />
              </div>

              {/* Menú Desktop */}
              <div className="hidden md:flex space-x-8 font-medium text-slate-600 text-sm uppercase tracking-wide items-center">
                {vistaActiva === 'industrial' ? (
                  <>
                    <button onClick={() => scrollTo('home')} className="hover:text-ekos-green transition">Home</button>
                    <button onClick={() => scrollTo('nosotros')} className="hover:text-ekos-green transition">Nosotros</button>
                    <button onClick={() => scrollTo('productos')} className="hover:text-ekos-green transition">Materias Primas</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => scrollTo('hero-obras')} className="hover:text-amber-600 transition">Inicio Obras</button>
                    <button onClick={() => scrollTo('servicios-obras')} className="hover:text-amber-600 transition">Servicios y SEC</button>
                  </>
                )}
                {/* Botón Volver al Portal */}
                <button onClick={volverAlPortal} className="text-xs text-gray-500 hover:text-red-600 transition underline">
                   Volver a Inicio
                </button>
                <button onClick={() => scrollTo('contacto')} className={`px-5 py-2 rounded text-white shadow-lg transition ${vistaActiva === 'industrial' ? 'bg-ekos-green hover:bg-green-900 shadow-green-900/20' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'}`}>
                  Contacto
                </button>
              </div>

              {/* Botón Móvil */}
              <button className="md:hidden text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>

            {/* Menú Móvil Desplegable */}
            {isMenuOpen && (
              <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 flex flex-col space-y-4 shadow-lg">
                 {vistaActiva === 'industrial' ? (
                   <>
                     <button onClick={() => scrollTo('home')} className="text-left py-2">Home</button>
                     <button onClick={() => scrollTo('nosotros')} className="text-left py-2">Nosotros</button>
                     <button onClick={() => scrollTo('productos')} className="text-left py-2">Materias Primas</button>
                   </>
                 ) : (
                   <>
                     <button onClick={() => scrollTo('hero-obras')} className="text-left py-2">Inicio Obras</button>
                     <button onClick={() => scrollTo('servicios-obras')} className="text-left py-2">Servicios y SEC</button>
                   </>
                 )}
                 <button onClick={volverAlPortal} className="text-left py-2 text-gray-500 underline text-sm">Volver a Inicio</button>
                 <button onClick={() => scrollTo('contacto')} className={`text-left py-2 font-bold ${vistaActiva === 'industrial' ? 'text-ekos-green' : 'text-amber-600'}`}>Contacto</button>
              </div>
            )}
          </nav>

          {/* ========================================================================= */}
          {/* ================= VISTA INTERNA 1: INDUSTRIAL (MINERALES) =============== */}
          {/* ========================================================================= */}
          {vistaActiva === 'industrial' && (
            <div className="animate-fade-in pt-16">
              {/* HERO SECTION MINERALES */}
              <header id="home" className="relative h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                  <img src={heroBg} alt="Textura Minerales" className="w-full h-full object-cover opacity-60 animate-pulse-slow" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80"></div>
                </div>
                
                <div className="relative z-10 container mx-auto px-6 text-center text-white mt-20">
                  <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl">SOLUCIONES <br/> INDUSTRIALES</h2>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed">Minerales Chile: Carbonato de Calcio, Talco, Caolín, Grafito y Materias Primas de Alta Pureza.</p>
                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full inline-block max-w-2xl mx-auto mb-10 px-8">
                     <p className="text-sm md:text-base text-gray-100 font-medium">📍 Bodega: Entrega en la ciudad de Santiago</p>
                  </div>

                  <div className="animate-bounce mt-4">
                    <button onClick={() => scrollTo('nosotros')} className="text-white/80 hover:text-white transition">
                      <ChevronDown size={48} />
                    </button>
                  </div>
                </div>
              </header>

              {/* SOBRE NOSOTROS (Original) */}
              <section id="nosotros" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2">
                      <h3 className="text-ekos-green font-bold tracking-widest uppercase mb-2 text-sm">Nuestra Empresa</h3>
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Aliados Estratégicos para su Industria</h2>
                      <div className="space-y-4 text-gray-600 text-justify leading-relaxed text-lg">
                        <p>Contamos con alianzas estratégicas para solucionar requerimientos de las diversas empresas. Nos especializamos en la distribución de materias primas esenciales como <strong>carbonato de calcio, talco industrial, caolín y grafito.</strong></p>
                        <p>Nuestro enfoque se centra en apoyar a empresas comprometidas con la sustentabilidad, asegurando que nuestros productos cumplan con los más altos estándares.</p>
                        <div className="bg-slate-50 p-6 border-l-4 border-ekos-green mt-6 rounded-r-lg">
                          <p className="text-sm text-slate-700 font-medium">"Las operaciones y el retiro de productos se realizan en nuestra Bodega central en la Región Metropolitana."</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-2 gap-4">
                       <img src={imgMina} className="rounded-2xl shadow-xl w-full h-64 object-cover transform translate-y-4" alt="Minería" />
                       <img src={imgPolvoBlanco} className="rounded-2xl shadow-xl w-full h-64 object-cover transform -translate-y-4" alt="Polvo Industrial" />
                    </div>
                  </div>
                </div>
              </section>

              {/* DETALLE PRODUCTOS (Original) */}
              <section id="productos" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900">Nuestras Materias Primas</h2>
                    <p className="text-gray-500 mt-4 text-lg">Especificaciones Técnicas y Aplicaciones Industriales</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
                      <div className="h-72 overflow-hidden relative bg-slate-100"><img src={imgCalcium} alt="Carbonato" className="w-full h-full object-contain p-4 mix-blend-multiply transition group-hover:scale-105 duration-700" /></div>
                      <div className="p-8"><h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3"><span className="w-8 h-8 bg-ekos-green text-white rounded-full flex items-center justify-center text-sm">1</span> Carbonato de Calcio</h3></div>
                    </div>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
                      <div className="h-72 overflow-hidden relative"><img src={imgTalco} alt="Talco" className="w-full h-full object-cover transition group-hover:scale-105 duration-700" /></div>
                      <div className="p-8"><h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3"><span className="w-8 h-8 bg-ekos-green text-white rounded-full flex items-center justify-center text-sm">2</span> Talco Industrial</h3></div>
                    </div>
            {/* PRODUCTO 3: BARITA BEIGE - INSERCIÓN AUTOMÁTICA */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
              <div className="h-72 overflow-hidden relative">
                <img src={imgBaritaBeige} alt="Barita Mineral Beige" className="w-full h-full object-cover transition transform group-hover:scale-105 duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow">Uso Industrial</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-ekos-green text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Barita (Sulfato de Bario)
                </h3>
                <p className="text-gray-600 mb-6 text-sm text-justify leading-relaxed border-b border-gray-100 pb-6">
                  Mineral industrial de alta densidad, color beige natural. Disponible en sacos de 25 kilos para diversas aplicaciones en manufactura y perforación.
                </p>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase mb-3 tracking-wider">Presentación</h4>
                  <ul className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-ekos-green"/> Color Beige</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-ekos-green"/> Sacos de 25 Kg</li>
                  </ul>
                </div>
              </div>
            </div>
                  </div>
                </div>
              </section>

              {/* CATÁLOGO VISUAL (Original) */}
              <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-bold text-center mb-2 text-slate-800">Catálogo Visual</h3>
                    <p className="text-center text-gray-500 mb-10 text-sm">Inventario y presentación de productos</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[imgSacos, imgPolvoBlanco, imgGrafito, imgKraft, imgTalco, imgCalcium].map((img, i) => (
                           <div key={i} className="relative group overflow-hidden rounded-lg shadow-sm border border-gray-100">
                                <img src={img} className="w-full h-48 object-cover transition duration-500 group-hover:scale-110" alt="Producto" />
                           </div>
                        ))}
                    </div>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ================= VISTA INTERNA 2: OBRAS Y SEC (CONSTRUCCIÓN) =========== */}
          {/* ========================================================================= */}
          {vistaActiva === 'construccion' && (
            <div className="animate-fade-in pt-16">
              {/* HERO SECTION CONSTRUCCIÓN (Placeholders) */}
              <header id="hero-obras" className="relative h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                  <img src={imgRemodelacion} alt="Hogar Obras" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-amber-950/50"></div>
                </div>
                
                <div className="relative z-10 container mx-auto px-6 text-left text-white mt-20">
                  <div className="inline-block bg-amber-600 text-white font-bold px-4 py-1 rounded-full text-sm mb-6 shadow-lg border border-amber-500 animate-pulse-slow">
                    División Obras Menores Domiciliarias
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl">
                    SU HOGAR, <br/>EN <span className="text-amber-500">BUENAS MANOS</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl font-light leading-relaxed">
                    Especialistas en remodelación de interiores, obras menores de construcción e instalaciones eléctricas autorizadas SEC. Seguridad y confianza domiciliaria.
                  </p>
                  
                  <div className="flex gap-4">
                     <button onClick={() => scrollTo('servicios-obras')} className="bg-white text-amber-600 px-8 py-3 rounded-lg font-bold hover:bg-amber-50 transition shadow-lg text-lg flex gap-2 items-center">
                       Explorar Servicios <ArrowRight />
                     </button>
                  </div>
                </div>
              </header>

              {/* SERVICIOS DE OBRAS Y SEC (Placeholders) */}
              <section id="servicios-obras" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                  <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-950 mb-4">Servicios Integrales de Remodelación</h2>
                    <p className="text-gray-600 text-lg">
                      Llevamos nuestra calidad y estándares industriales a su hogar con obras menores y certificaciones autorizadas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tarjeta 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                        <HardHat className="text-amber-600" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Obras Menores de Construcción</h3>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        Ejecución de tabiquería, ampliaciones, pintura profesional, techumbres y remodelación de espacios como baños y cocinas. Entregas llave en mano.
                      </p>
                    </div>

                    {/* Tarjeta 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300 group hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">Urgente y Normativo</div>
                      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                        <Zap className="text-amber-600" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Instalaciones SEC</h3>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        Reparaciones eléctricas e instalaciones domiciliarias bajo estricta normativa de la <strong>Superintendencia de Electricidad y Combustibles (SEC)</strong>. Regularizaciones autorizadas.
                      </p>
                    </div>

                    {/* Tarjeta 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                        <Wrench className="text-amber-600" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Mantenimiento y Reparaciones</h3>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        Servicio preventivo y correctivo para su vivienda: instalación de pisos (flotante, cerámico), griferías, cerrajería y obras menores de gasfitería.
                      </p>
                    </div>
                  </div>

                  {/* Banner SEC Destacado */}
                  <div className="mt-16 bg-gradient-to-r from-slate-950 to-slate-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                     <div className="md:w-2/3 flex items-start gap-4">
                        <Zap className="text-amber-500 mt-1 flex-shrink-0" size={28}/>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-3">Compromiso Normativo SEC</h3>
                          <p className="text-gray-300 leading-relaxed text-justify">
                            En Ekos Pack SpA priorizamos la seguridad de su hogar. Todas las instalaciones eléctricas o de combustibles son ejecutadas por profesionales autorizados y certificados por la Superintendencia de Electricidad y Combustibles (SEC). No arriesgue su seguridad.
                          </p>
                        </div>
                     </div>
                     <div className="md:w-1/3 text-center md:text-right">
                        <button onClick={() => scrollTo('contacto')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 w-full md:w-auto text-lg">
                          Agendar Visita de Evaluación
                        </button>
                     </div>
                  </div>

                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* =================== FOOTER UNIVERSAL (Aparece en ambas) ================= */}
          {/* ========================================================================= */}
          <footer id="contacto" className={`py-16 text-white ${vistaActiva === 'industrial' ? 'bg-slate-950' : 'bg-slate-900'}`}>
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="mb-8 bg-white p-3 rounded-lg inline-block">
                     <img src={logoImg} alt="Logo Footer" className="h-16 w-auto object-contain" />
                  </div>
                  
                  <p className="text-gray-400 mb-8 max-w-md text-sm leading-relaxed">
                    Contáctenos para recibir cotización formal de materias primas industriales o agendar una visita técnica de evaluación para obras menores en su domicilio.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                        <div className={`p-2 rounded-lg transition ${vistaActiva === 'industrial' ? 'bg-slate-800 group-hover:bg-ekos-green' : 'bg-slate-800 group-hover:bg-amber-600'}`}>
                            <Phone className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <a href="tel:+56941337066" className={`text-gray-300 transition font-medium ${vistaActiva === 'industrial' ? 'hover:text-ekos-green' : 'hover:text-amber-500'}`}>+56 9 4133 7066</a>
                            <a href="tel:+56947531776" className={`text-gray-300 transition font-medium ${vistaActiva === 'industrial' ? 'hover:text-ekos-green' : 'hover:text-amber-500'}`}>+56 9 4753 1776</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className={`p-2 rounded-lg transition ${vistaActiva === 'industrial' ? 'bg-slate-800 group-hover:bg-ekos-green' : 'bg-slate-800 group-hover:bg-amber-600'}`}>
                            <Mail className="text-white" size={20} />
                    </div>
                        <a href="mailto:contacto@ekospack.cl" className={`text-gray-300 transition font-medium ${vistaActiva === 'industrial' ? 'hover:text-ekos-green' : 'hover:text-amber-500'}`}>contacto@ekospack.cl</a>
                    </div>
                  </div>

              {/* MAPA GOOGLE EMBEBIDO (LA GRANJA) - INSERCIÓN AUTOMÁTICA */}
              <div className="mt-6 w-full h-48 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
                <iframe 
                  src="https://maps.google.com/maps?q=La%20Granja,%20Santiago,%20Chile&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación General Comuna La Granja"
                ></iframe>
              </div>

                  {/* TÉRMINOS LEGALES */}
                  <div className="mt-8 pt-8 border-t border-slate-800">
                    <button onClick={() => setShowTerms(true)} className="text-gray-500 text-xs hover:text-white transition text-left underline flex items-center gap-2">
                      <FileText size={14} /> Términos y Condiciones Legales Unificados
                    </button>
                  </div>
                </div>

                {/* Formulario/Banner de Cotización Dinámico */}
                <div className={`bg-gradient-to-br p-8 rounded-2xl border shadow-2xl ${vistaActiva === 'industrial' ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-slate-800 to-slate-800 border-amber-900/30'}`}>
                   {isSuccess ? (
                     <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in space-y-4">
                       <CheckCircle size={64} className={vistaActiva === 'industrial' ? 'text-ekos-green' : 'text-amber-500'} />
                       <h3 className="text-2xl font-bold text-white">¡Mensaje Enviado!</h3>
                       <p className="text-gray-300">Hemos recibido su solicitud y nos contactaremos a la brevedad.</p>
                       <button 
                         onClick={() => setIsSuccess(false)}
                         className="mt-4 px-6 py-2 rounded-lg text-sm font-medium border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition"
                       >
                         Enviar otro mensaje
                       </button>
                     </div>
                   ) : (
                     <>
                       <h3 className="text-xl font-bold mb-2">¿Necesita una cotización?</h3>
                       <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                         {vistaActiva === 'industrial' 
                           ? 'Para retiro de material o evaluación de compra industrial, envíenos un correo describiendo su pedido.' 
                           : 'Describa brevemente el tipo de obra domiciliaria o instalación SEC que requiere para su evaluación técnico-comercial.'}
                       </p>
                       
                       <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                           <input 
                             type="text" 
                             name="nombre"
                             value={formData.nombre}
                             onChange={handleInputChange}
                             placeholder="Nombre o Empresa" 
                             required
                             disabled={isSubmitting}
                             className={`w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition focus:border-transparent ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${vistaActiva === 'industrial' ? 'focus:ring-ekos-green' : 'focus:ring-amber-500'}`}
                           />
                         </div>
                         <div>
                           <input 
                             type="email" 
                             name="email"
                             value={formData.email}
                             onChange={handleInputChange}
                             placeholder="Correo Electrónico" 
                             required
                             disabled={isSubmitting}
                             className={`w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition focus:border-transparent ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${vistaActiva === 'industrial' ? 'focus:ring-ekos-green' : 'focus:ring-amber-500'}`}
                           />
                         </div>
                         <div>
                           <textarea 
                             name="mensaje"
                             value={formData.mensaje}
                             onChange={handleInputChange}
                             placeholder="Su mensaje..." 
                             rows="4"
                             required
                             disabled={isSubmitting}
                             className={`w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition resize-none focus:border-transparent ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${vistaActiva === 'industrial' ? 'focus:ring-ekos-green' : 'focus:ring-amber-500'}`}
                           ></textarea>
                         </div>
                         <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className={`w-full text-white text-center py-4 rounded-xl font-bold transition transform shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : (vistaActiva === 'industrial' ? 'bg-ekos-green hover:bg-green-700 hover:-translate-y-1' : 'bg-amber-600 hover:bg-amber-700 hover:-translate-y-1')}`}
                         >
                           {isSubmitting ? (
                             <>
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                               </svg>
                               Enviando...
                             </>
                           ) : 'Enviar Solicitud de Contacto'}
                         </button>
                       </form>
                     </>
                   )}
                </div>
              </div>
              
              <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Ekos Pack SpA. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;