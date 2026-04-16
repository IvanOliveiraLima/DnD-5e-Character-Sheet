const translations = {
  'en': {
    // Sidebar
    'my_characters': '← My Characters',
    'attributes': 'Attributes',
    'backstory': 'Backstory',
    'inventory': 'Inv. & NPCs',
    'spells': 'Spell Sheet',
    'notes': 'Notes',
    'generate_ai': '✨ Generate with AI',
    'sign_in': 'Sign in to sync',
    'sign_out': 'Sign out',
    'options': 'Options',
    'new_blank': 'New Blank Sheet',
    'export_json': 'Export JSON',
    'import_json': 'Import JSON',
    'lock_sheet': 'Lock/Unlock Sheet',
    // Character select
    'my_characters_title': 'My Characters',
    'new_character': '+ New Character',
    'export_all': 'Export All',
    'import': 'Import',
    'open': 'Open',
    'last_edited': 'Last edited',
    'no_characters': 'No characters yet. Create one to get started!',
    // Sheet labels
    'character_name': 'Character Name',
    'class': 'Class',
    'level': 'Level',
    'total_level': 'Total Level',
    'race': 'Race',
    'background': 'Background',
    'player_name': 'Player Name',
    'experience': 'Experience',
    'alignment': 'Alignment',
    // Status
    'status': 'Status',
    'temp_health': 'Temporary Health',
    'current_health': 'Current Health',
    'max_health': 'Maximum Health',
    'hit_dice': 'Hit Dice',
    'current': 'Current',
    'death_saves': 'Death Saves',
    'success': 'Success',
    'failure': 'Failure',
    'conditions': 'Conditions',
    'boons': 'Boons',
    // Attributes
    'attributes_section': 'Attributes',
    'proficiency_bonus': 'Proficiency Bonus',
    'initiative_bonus': 'Initiative Bonus',
    'passive_perception': 'Passive Perception',
    'armor_class': 'Armor Class',
    'speed': 'Speed',
    'spell_save_dc': 'Spell Save DC',
    // Auth modal
    'sign_in_title': 'Sign in',
    'create_account': 'Create account',
    'email': 'Email',
    'password': 'Password',
    'forgot_password': 'Forgot password?',
    'google_sign_in': 'Continue with Google',
    'close': 'Close',
    // AI modal
    'generate_title': 'Generate Character with AI',
    'describe_character': 'Describe your character',
    'generate_btn': '✨ Generate',
    'cancel': 'Cancel',
    'generating': 'Generating your character...',
    // Sync
    'synced': 'Synced',
    'syncing': 'Syncing...',
    'sync_error': 'Sync failed — retrying',
  },
  'pt': {
    // Sidebar
    'my_characters': '← Meus Personagens',
    'attributes': 'Atributos',
    'backstory': 'História',
    'inventory': 'Inv. & NPCs',
    'spells': 'Magias',
    'notes': 'Notas',
    'generate_ai': '✨ Gerar com IA',
    'sign_in': 'Entrar para sincronizar',
    'sign_out': 'Sair',
    'options': 'Opções',
    'new_blank': 'Nova Ficha em Branco',
    'export_json': 'Exportar JSON',
    'import_json': 'Importar JSON',
    'lock_sheet': 'Travar/Destravar Ficha',
    // Character select
    'my_characters_title': 'Meus Personagens',
    'new_character': '+ Novo Personagem',
    'export_all': 'Exportar Tudo',
    'import': 'Importar',
    'open': 'Abrir',
    'last_edited': 'Editado em',
    'no_characters': 'Nenhum personagem ainda. Crie um para começar!',
    // Sheet labels
    'character_name': 'Nome do Personagem',
    'class': 'Classe',
    'level': 'Nível',
    'total_level': 'Nível Total',
    'race': 'Raça',
    'background': 'Antecedente',
    'player_name': 'Nome do Jogador',
    'experience': 'Experiência',
    'alignment': 'Alinhamento',
    // Status
    'status': 'Status',
    'temp_health': 'Vida Temporária',
    'current_health': 'Vida Atual',
    'max_health': 'Vida Máxima',
    'hit_dice': 'Dado de Vida',
    'current': 'Atual',
    'death_saves': 'Testes de Morte',
    'success': 'Sucesso',
    'failure': 'Falha',
    'conditions': 'Condições',
    'boons': 'Bênçãos',
    // Attributes
    'attributes_section': 'Atributos',
    'proficiency_bonus': 'Bônus de Proficiência',
    'initiative_bonus': 'Bônus de Iniciativa',
    'passive_perception': 'Percepção Passiva',
    'armor_class': 'Classe de Armadura',
    'speed': 'Deslocamento',
    'spell_save_dc': 'CD de Magia',
    // Auth modal
    'sign_in_title': 'Entrar',
    'create_account': 'Criar conta',
    'email': 'E-mail',
    'password': 'Senha',
    'forgot_password': 'Esqueceu a senha?',
    'google_sign_in': 'Continuar com Google',
    'close': 'Fechar',
    // AI modal
    'generate_title': 'Gerar Personagem com IA',
    'describe_character': 'Descreva seu personagem',
    'generate_btn': '✨ Gerar',
    'cancel': 'Cancelar',
    'generating': 'Gerando seu personagem...',
    // Sync
    'synced': 'Sincronizado',
    'syncing': 'Sincronizando...',
    'sync_error': 'Falha na sync — tentando novamente',
  }
}

const STORAGE_KEY = 'dnd_language'

let currentLang = localStorage.getItem(STORAGE_KEY) || 'en'

export function getLang() {
  return currentLang
}

export function setLang(lang) {
  if (!translations[lang]) return
  currentLang = lang
  localStorage.setItem(STORAGE_KEY, lang)
  applyTranslations()
}

export function t(key) {
  return translations[currentLang]?.[key] || translations['en']?.[key] || key
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    el.textContent = t(key)
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'))
  })
}
