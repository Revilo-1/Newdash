export type Language = 'en' | 'da'

export interface Translations {
  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    add: string
    remove: string
    loading: string
    error: string
    success: string
    confirm: string
    back: string
    next: string
    previous: string
    close: string
    open: string
    search: string
    filter: string
    sort: string
    all: string
    none: string
    select: string
    selected: string
    today: string
    yesterday: string
    tomorrow: string
  }

  // Navigation
  navigation: {
    dashboard: string
    tasks: string
    healthWellness: string
    users: string
    aiIntegration: string
    api: string
    notifications: string
    newsletter: string
    settings: string
    calendar: string
    signOut: string
    profile: string
  }

  // Dashboard
  dashboard: {
    title: string
    welcome: string
    privateMode: string
    workMode: string
    kpiCards: {
      healthWellness: string
      activityLevel: string
      goalsAchieved: string
      streakDays: string
      revenue: string
      salesPerformance: string
      customerSatisfaction: string
      teamProductivity: string
    }
    recentTasks: string
    upcomingEvents: string
    overviewCharts: {
      personalGrowth: string
      healthWellness: string
      revenue: string
      salesPerformance: string
    }
  }

  // Tasks
    tasks: {
      title: string
      completedToday: string
      allTasks: string
      filter: string
      sort: string
      rules: string
      fields: string
      addTask: string
      editColumnTitle: string
      saveColumnTitle: string
      cancelEdit: string
      columns: {
        november: string
        december: string
        january: string
        done: string
      }
      priority: {
        p1: string
        p2: string
        p3: string
      }
      status: {
        started: string
        notStarted: string
        done: string
      }
    }

  // Health & Wellness
  healthWellness: {
    title: string
    subtitle: string
    metrics: {
      healthWellness: string
      activityLevel: string
      goalsAchieved: string
      streakDays: string
    }
    trainingCalendar: string
    addTraining: string
    todaysTraining: string
    noTrainingScheduled: string
    addFirstWorkout: string
    trainingTypes: {
      bicepsTricepsMave: string
      rygBrystSkulder: string
      benAss: string
    }
    intensity: {
      low: string
      medium: string
      high: string
    }
    addTrainingSession: string
    trainingType: string
    duration: string
    notes: string
    howDidItFeel: string
  }

  // Settings
  settings: {
    title: string
    subtitle: string
    sections: {
      profile: {
        title: string
        description: string
        profilePicture: string
        clickToUpload: string
        upload: string
        remove: string
        personalInformation: string
        firstName: string
        lastName: string
        email: string
        phone: string
        location: string
        birthday: string
        bio: string
        website: string
      }
      account: {
        title: string
        description: string
        changePassword: string
        currentPassword: string
        newPassword: string
        confirmPassword: string
        securitySettings: string
        twoFactorAuth: string
        twoFactorDescription: string
        loginNotifications: string
        loginNotificationsDescription: string
        sessionSettings: string
        sessionTimeout: string
        minutes: string
        hours: string
      }
      notifications: {
        title: string
        description: string
        preferences: string
        emailNotifications: string
        emailDescription: string
        pushNotifications: string
        pushDescription: string
        smsNotifications: string
        smsDescription: string
        marketingEmails: string
        marketingDescription: string
        weeklyReports: string
        weeklyDescription: string
        taskReminders: string
        taskDescription: string
        healthReminders: string
        healthDescription: string
        systemUpdates: string
        systemDescription: string
      }
      appearance: {
        title: string
        description: string
        themeDisplay: string
        theme: string
        light: string
        dark: string
        auto: string
        language: string
        english: string
        dansk: string
        deutsch: string
        francais: string
        timezone: string
        copenhagen: string
        london: string
        newYork: string
        tokyo: string
        dateFormat: string
        timeFormat: string
        hour12: string
        hour24: string
        interfacePreferences: string
        collapseSidebar: string
        collapseDescription: string
        enableAnimations: string
        animationsDescription: string
      }
      privacy: {
        title: string
        description: string
        privacySettings: string
        profileVisibility: string
        public: string
        private: string
        friendsOnly: string
        dataSharing: string
        dataSharingDescription: string
        analytics: string
        analyticsDescription: string
        dataManagement: string
        dataRetention: string
        year: string
        years: string
        forever: string
        acceptCookies: string
        cookiesDescription: string
        dangerZone: string
        dangerDescription: string
        downloadData: string
        deleteAccount: string
      }
    }
    saveChanges: string
  }

  // Auth
  auth: {
    login: {
      title: string
      subtitle: string
      email: string
      password: string
      showPassword: string
      hidePassword: string
      rememberMe: string
      forgotPassword: string
      signIn: string
      noAccount: string
      signUp: string
      invalidCredentials: string
      loginError: string
    }
  }

  // Sidebar
  sidebar: {
    mainMenu: string
    others: string
    accountSettings: string
    comingSoon: string
  }

  // User Management
  userManagement: {
    title: string
    subtitle: string
    addUser: string
    totalUsers: string
    activeUsers: string
    admins: string
    pending: string
    searchUsers: string
    allStatus: string
    allRoles: string
    user: string
    role: string
    status: string
    department: string
    lastLogin: string
    actions: string
    createNewUser: string
    editUser: string
    userDetails: string
    fullName: string
    email: string
    phone: string
    notes: string
    additionalNotes: string
    saveChanges: string
    createUser: string
    cancel: string
    deleteUser: string
    confirmDelete: string
    never: string
    accessDenied: string
    noPermission: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      all: 'All',
      none: 'None',
      select: 'Select',
      selected: 'Selected',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow'
    },
    navigation: {
      dashboard: 'Dashboard',
      tasks: 'Tasks',
      healthWellness: 'Health & Wellness',
      users: 'Users',
      aiIntegration: 'AI Integration',
      api: 'API',
      notifications: 'Send Notification',
      newsletter: 'Send Newsletter',
      settings: 'Settings',
      calendar: 'Calendar',
      signOut: 'Sign out',
      profile: 'Profile'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      privateMode: 'Private',
      workMode: 'Work',
      kpiCards: {
        healthWellness: 'Health & Wellness',
        activityLevel: 'Activity Level',
        goalsAchieved: 'Goals Achieved',
        streakDays: 'Streak Days',
        revenue: 'Revenue',
        salesPerformance: 'Sales Performance',
        customerSatisfaction: 'Customer Satisfaction',
        teamProductivity: 'Team Productivity'
      },
      recentTasks: 'Recent Tasks',
      upcomingEvents: 'Upcoming Events',
      overviewCharts: {
        personalGrowth: 'Personal Growth',
        healthWellness: 'Health & Wellness',
        revenue: 'Revenue',
        salesPerformance: 'Sales Performance'
      }
    },
    tasks: {
      title: 'Tasks',
      completedToday: 'tasks completed today',
      allTasks: 'All tasks',
      filter: 'Filter',
      sort: 'Sort',
      rules: 'Rules',
      fields: 'Fields',
      addTask: 'Add Task',
      editColumnTitle: 'Edit column title',
      saveColumnTitle: 'Save column title',
      cancelEdit: 'Cancel edit',
      columns: {
        november: 'November',
        december: 'December',
        january: 'January',
        done: 'Done'
      },
      priority: {
        p1: 'P1',
        p2: 'P2',
        p3: 'P3'
      },
      status: {
        started: 'Started',
        notStarted: 'Not started',
        done: 'Done'
      }
    },
    healthWellness: {
      title: 'Health & Wellness',
      subtitle: 'Your journey to a healthier, happier you starts here. Track your progress, plan your training, and celebrate every milestone.',
      metrics: {
        healthWellness: 'Health & Wellness',
        activityLevel: 'Activity Level',
        goalsAchieved: 'Goals Achieved',
        streakDays: 'Streak Days'
      },
      trainingCalendar: 'Training Calendar',
      addTraining: 'Add Training',
      todaysTraining: "Today's Training",
      noTrainingScheduled: 'No training scheduled for this day',
      addFirstWorkout: 'Add your first workout',
      trainingTypes: {
        bicepsTricepsMave: 'Biceps & Triceps + Mave',
        rygBrystSkulder: 'Ryg, Bryst og Skulder',
        benAss: 'Ben & A$$'
      },
      intensity: {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      },
      addTrainingSession: 'Add Training Session',
      trainingType: 'Training Type',
      duration: 'Duration (min)',
      notes: 'Notes (optional)',
      howDidItFeel: 'How did it feel? Any achievements?'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your account settings and preferences.',
      sections: {
        profile: {
          title: 'Profile Information',
          description: 'Manage your personal information and profile details',
          profilePicture: 'Profile Picture',
          clickToUpload: 'Click to upload a new profile picture',
          upload: 'Upload',
          remove: 'Remove',
          personalInformation: 'Personal Information',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          phone: 'Phone',
          location: 'Location',
          birthday: 'Birthday',
          bio: 'Bio',
          website: 'Website'
        },
        account: {
          title: 'Account Settings',
          description: 'Security settings and account preferences',
          changePassword: 'Change Password',
          currentPassword: 'Current Password',
          newPassword: 'New Password',
          confirmPassword: 'Confirm New Password',
          securitySettings: 'Security Settings',
          twoFactorAuth: 'Two-Factor Authentication',
          twoFactorDescription: 'Add an extra layer of security to your account',
          loginNotifications: 'Login Notifications',
          loginNotificationsDescription: 'Get notified when someone logs into your account',
          sessionSettings: 'Session Settings',
          sessionTimeout: 'Session Timeout',
          minutes: 'minutes',
          hours: 'hours'
        },
        notifications: {
          title: 'Notifications',
          description: 'Configure how you receive notifications',
          preferences: 'Notification Preferences',
          emailNotifications: 'Email Notifications',
          emailDescription: 'Receive notifications via email',
          pushNotifications: 'Push Notifications',
          pushDescription: 'Receive push notifications in your browser',
          smsNotifications: 'SMS Notifications',
          smsDescription: 'Receive notifications via SMS',
          marketingEmails: 'Marketing Emails',
          marketingDescription: 'Receive promotional emails and updates',
          weeklyReports: 'Weekly Reports',
          weeklyDescription: 'Get weekly summary reports',
          taskReminders: 'Task Reminders',
          taskDescription: 'Get reminded about upcoming tasks',
          healthReminders: 'Health Reminders',
          healthDescription: 'Get reminded about health and wellness activities',
          systemUpdates: 'System Updates',
          systemDescription: 'Get notified about system updates and maintenance'
        },
        appearance: {
          title: 'Appearance',
          description: 'Customize the look and feel of your dashboard',
          themeDisplay: 'Theme & Display',
          theme: 'Theme',
          light: 'Light',
          dark: 'Dark',
          auto: 'Auto',
          language: 'Language',
          english: 'English',
          dansk: 'Dansk',
          deutsch: 'Deutsch',
          francais: 'Français',
          timezone: 'Timezone',
          copenhagen: 'Copenhagen (GMT+1)',
          london: 'London (GMT+0)',
          newYork: 'New York (GMT-5)',
          tokyo: 'Tokyo (GMT+9)',
          dateFormat: 'Date Format',
          timeFormat: 'Time Format',
          hour12: '12-hour (AM/PM)',
          hour24: '24-hour',
          interfacePreferences: 'Interface Preferences',
          collapseSidebar: 'Collapse Sidebar by Default',
          collapseDescription: 'Start with the sidebar collapsed',
          enableAnimations: 'Enable Animations',
          animationsDescription: 'Show smooth transitions and animations'
        },
        privacy: {
          title: 'Privacy & Data',
          description: 'Control your privacy settings and data usage',
          privacySettings: 'Privacy Settings',
          profileVisibility: 'Profile Visibility',
          public: 'Public',
          private: 'Private',
          friendsOnly: 'Friends Only',
          dataSharing: 'Data Sharing',
          dataSharingDescription: 'Allow sharing of anonymized data for product improvement',
          analytics: 'Analytics',
          analyticsDescription: 'Help us improve by sharing usage analytics',
          dataManagement: 'Data Management',
          dataRetention: 'Data Retention Period',
          year: 'year',
          years: 'years',
          forever: 'Forever',
          acceptCookies: 'Accept Cookies',
          cookiesDescription: 'Allow cookies for better user experience',
          dangerZone: 'Danger Zone',
          dangerDescription: 'These actions are irreversible. Please proceed with caution.',
          downloadData: 'Download My Data',
          deleteAccount: 'Delete My Account'
        }
      },
      saveChanges: 'Save Changes'
    },
    auth: {
      login: {
        title: 'Sign in to your account',
        subtitle: 'Enter your credentials to access your dashboard',
        email: 'Email address',
        password: 'Password',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot your password?',
        signIn: 'Sign in',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        invalidCredentials: 'Invalid email or password',
        loginError: 'An error occurred during login'
      }
    },
    sidebar: {
      mainMenu: 'MAIN MENU',
      others: 'OTHERS',
      accountSettings: 'Account Settings',
      comingSoon: 'Soon'
    },
    userManagement: {
      title: 'User Management',
      subtitle: 'Manage users, roles, and permissions for your platform.',
      addUser: 'Add User',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      admins: 'Admins',
      pending: 'Pending',
      searchUsers: 'Search users...',
      allStatus: 'All Status',
      allRoles: 'All Roles',
      user: 'User',
      role: 'Role',
      status: 'Status',
      department: 'Department',
      lastLogin: 'Last Login',
      actions: 'Actions',
      createNewUser: 'Create New User',
      editUser: 'Edit User',
      userDetails: 'User Details',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      notes: 'Notes',
      additionalNotes: 'Additional notes about this user...',
      saveChanges: 'Save Changes',
      createUser: 'Create User',
      cancel: 'Cancel',
      deleteUser: 'Delete User',
      confirmDelete: 'Are you sure you want to delete this user?',
      never: 'Never',
      accessDenied: 'Access Denied',
      noPermission: "You don't have permission to access this page."
    }
  },
  da: {
    common: {
      save: 'Gem',
      cancel: 'Annuller',
      delete: 'Slet',
      edit: 'Rediger',
      add: 'Tilføj',
      remove: 'Fjern',
      loading: 'Indlæser...',
      error: 'Fejl',
      success: 'Succes',
      confirm: 'Bekræft',
      back: 'Tilbage',
      next: 'Næste',
      previous: 'Forrige',
      close: 'Luk',
      open: 'Åbn',
      search: 'Søg',
      filter: 'Filtrer',
      sort: 'Sorter',
      all: 'Alle',
      none: 'Ingen',
      select: 'Vælg',
      selected: 'Valgt',
      today: 'I dag',
      yesterday: 'I går',
      tomorrow: 'I morgen'
    },
    navigation: {
      dashboard: 'Dashboard',
      tasks: 'Opgaver',
      healthWellness: 'Sundhed & Trivsel',
      users: 'Brugere',
      aiIntegration: 'AI Integration',
      api: 'API',
      notifications: 'Send Besked',
      newsletter: 'Send Nyhedsbrev',
      settings: 'Indstillinger',
      calendar: 'Kalender',
      signOut: 'Log ud',
      profile: 'Profil'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Velkommen',
      privateMode: 'Privat',
      workMode: 'Arbejde',
      kpiCards: {
        healthWellness: 'Sundhed & Trivsel',
        activityLevel: 'Aktivitetsniveau',
        goalsAchieved: 'Mål Opnået',
        streakDays: 'Streak Dage',
        revenue: 'Omsætning',
        salesPerformance: 'Salgsperformance',
        customerSatisfaction: 'Kundetilfredshed',
        teamProductivity: 'Teamproduktivitet'
      },
      recentTasks: 'Seneste Opgaver',
      upcomingEvents: 'Kommende Begivenheder',
      overviewCharts: {
        personalGrowth: 'Personlig Vækst',
        healthWellness: 'Sundhed & Trivsel',
        revenue: 'Omsætning',
        salesPerformance: 'Salgsperformance'
      }
    },
    tasks: {
      title: 'Opgaver',
      completedToday: 'opgaver færdiggjort i dag',
      allTasks: 'Alle opgaver',
      filter: 'Filtrer',
      sort: 'Sorter',
      rules: 'Regler',
      fields: 'Felter',
      addTask: 'Tilføj Opgave',
      editColumnTitle: 'Rediger kolonne titel',
      saveColumnTitle: 'Gem kolonne titel',
      cancelEdit: 'Annuller redigering',
      columns: {
        november: 'November',
        december: 'December',
        january: 'Januar',
        done: 'Færdig'
      },
      priority: {
        p1: 'P1',
        p2: 'P2',
        p3: 'P3'
      },
      status: {
        started: 'Startet',
        notStarted: 'Ikke startet',
        done: 'Færdig'
      }
    },
    healthWellness: {
      title: 'Sundhed & Trivsel',
      subtitle: 'Din rejse til et sundere og gladere liv starter her. Spor din fremgang, planlæg din træning og fejr hver milepæl.',
      metrics: {
        healthWellness: 'Sundhed & Trivsel',
        activityLevel: 'Aktivitetsniveau',
        goalsAchieved: 'Mål Opnået',
        streakDays: 'Streak Dage'
      },
      trainingCalendar: 'Træningskalender',
      addTraining: 'Tilføj Træning',
      todaysTraining: 'Dagens Træning',
      noTrainingScheduled: 'Ingen træning planlagt til denne dag',
      addFirstWorkout: 'Tilføj din første træning',
      trainingTypes: {
        bicepsTricepsMave: 'Biceps & Triceps + Mave',
        rygBrystSkulder: 'Ryg, Bryst og Skulder',
        benAss: 'Ben & A$$'
      },
      intensity: {
        low: 'Lav',
        medium: 'Medium',
        high: 'Høj'
      },
      addTrainingSession: 'Tilføj Træningssession',
      trainingType: 'Træningstype',
      duration: 'Varighed (min)',
      notes: 'Noter (valgfrit)',
      howDidItFeel: 'Hvordan føltes det? Nogen præstationer?'
    },
    settings: {
      title: 'Indstillinger',
      subtitle: 'Administrer dine kontoindstillinger og præferencer.',
      sections: {
        profile: {
          title: 'Profilinformation',
          description: 'Administrer dine personlige oplysninger og profildetaljer',
          profilePicture: 'Profilbillede',
          clickToUpload: 'Klik for at uploade et nyt profilbillede',
          upload: 'Upload',
          remove: 'Fjern',
          personalInformation: 'Personlige Oplysninger',
          firstName: 'Fornavn',
          lastName: 'Efternavn',
          email: 'E-mail',
          phone: 'Telefon',
          location: 'Lokation',
          birthday: 'Fødselsdag',
          bio: 'Bio',
          website: 'Hjemmeside'
        },
        account: {
          title: 'Kontoindstillinger',
          description: 'Sikkerhedsindstillinger og kontoindstillinger',
          changePassword: 'Skift Adgangskode',
          currentPassword: 'Nuværende Adgangskode',
          newPassword: 'Ny Adgangskode',
          confirmPassword: 'Bekræft Ny Adgangskode',
          securitySettings: 'Sikkerhedsindstillinger',
          twoFactorAuth: 'To-Faktor Godkendelse',
          twoFactorDescription: 'Tilføj et ekstra sikkerhedslag til din konto',
          loginNotifications: 'Login-beskeder',
          loginNotificationsDescription: 'Bliv underrettet når nogen logger ind på din konto',
          sessionSettings: 'Session-indstillinger',
          sessionTimeout: 'Session Timeout',
          minutes: 'minutter',
          hours: 'timer'
        },
        notifications: {
          title: 'Beskeder',
          description: 'Konfigurer hvordan du modtager beskeder',
          preferences: 'Beskedpræferencer',
          emailNotifications: 'E-mail Beskeder',
          emailDescription: 'Modtag beskeder via e-mail',
          pushNotifications: 'Push-beskeder',
          pushDescription: 'Modtag push-beskeder i din browser',
          smsNotifications: 'SMS Beskeder',
          smsDescription: 'Modtag beskeder via SMS',
          marketingEmails: 'Marketing E-mails',
          marketingDescription: 'Modtag reklame-e-mails og opdateringer',
          weeklyReports: 'Ugentlige Rapporter',
          weeklyDescription: 'Få ugentlige sammenfatningsrapporter',
          taskReminders: 'Opgavepåmindelser',
          taskDescription: 'Bliv påmindet om kommende opgaver',
          healthReminders: 'Sundhedspåmindelser',
          healthDescription: 'Bliv påmindet om sundheds- og trivselsaktiviteter',
          systemUpdates: 'Systemopdateringer',
          systemDescription: 'Bliv underrettet om systemopdateringer og vedligeholdelse'
        },
        appearance: {
          title: 'Udseende',
          description: 'Tilpas udseendet og følelsen af dit dashboard',
          themeDisplay: 'Tema & Visning',
          theme: 'Tema',
          light: 'Lys',
          dark: 'Mørk',
          auto: 'Auto',
          language: 'Sprog',
          english: 'English',
          dansk: 'Dansk',
          deutsch: 'Deutsch',
          francais: 'Français',
          timezone: 'Tidszone',
          copenhagen: 'København (GMT+1)',
          london: 'London (GMT+0)',
          newYork: 'New York (GMT-5)',
          tokyo: 'Tokyo (GMT+9)',
          dateFormat: 'Datoformat',
          timeFormat: 'Tidsformat',
          hour12: '12-timer (AM/PM)',
          hour24: '24-timer',
          interfacePreferences: 'Interface-præferencer',
          collapseSidebar: 'Skjul Sidebar som Standard',
          collapseDescription: 'Start med sidebar skjult',
          enableAnimations: 'Aktivér Animationer',
          animationsDescription: 'Vis glatte overgange og animationer'
        },
        privacy: {
          title: 'Privatliv & Data',
          description: 'Kontroller dine privatlivsindstillinger og dataforbrug',
          privacySettings: 'Privatlivsindstillinger',
          profileVisibility: 'Profilens Synlighed',
          public: 'Offentlig',
          private: 'Privat',
          friendsOnly: 'Kun Venner',
          dataSharing: 'Datadeling',
          dataSharingDescription: 'Tillad deling af anonymiserede data til produktforbedring',
          analytics: 'Analytik',
          analyticsDescription: 'Hjælp os med at forbedre ved at dele brugsanalytik',
          dataManagement: 'Dataadministration',
          dataRetention: 'Dataopbevaring',
          year: 'år',
          years: 'år',
          forever: 'For evigt',
          acceptCookies: 'Accepter Cookies',
          cookiesDescription: 'Tillad cookies for bedre brugeroplevelse',
          dangerZone: 'Farezone',
          dangerDescription: 'Disse handlinger er irreversible. Fortsæt med forsigtighed.',
          downloadData: 'Download Mine Data',
          deleteAccount: 'Slet Min Konto'
        }
      },
      saveChanges: 'Gem Ændringer'
    },
    auth: {
      login: {
        title: 'Log ind på din konto',
        subtitle: 'Indtast dine legitimationsoplysninger for at få adgang til dit dashboard',
        email: 'E-mail adresse',
        password: 'Adgangskode',
        showPassword: 'Vis adgangskode',
        hidePassword: 'Skjul adgangskode',
        rememberMe: 'Husk mig',
        forgotPassword: 'Glemt din adgangskode?',
        signIn: 'Log ind',
        noAccount: 'Har du ikke en konto?',
        signUp: 'Tilmeld dig',
        invalidCredentials: 'Ugyldig e-mail eller adgangskode',
        loginError: 'Der opstod en fejl under login'
      }
    },
    sidebar: {
      mainMenu: 'HOVEDMENU',
      others: 'ANDRE',
      accountSettings: 'Kontoindstillinger',
      comingSoon: 'Kommer snart'
    },
    userManagement: {
      title: 'Brugeradministration',
      subtitle: 'Administrer brugere, roller og tilladelser for din platform.',
      addUser: 'Tilføj Bruger',
      totalUsers: 'Samlede Brugere',
      activeUsers: 'Aktive Brugere',
      admins: 'Administratorer',
      pending: 'Afventende',
      searchUsers: 'Søg brugere...',
      allStatus: 'Alle Statusser',
      allRoles: 'Alle Roller',
      user: 'Bruger',
      role: 'Rolle',
      status: 'Status',
      department: 'Afdeling',
      lastLogin: 'Sidste Login',
      actions: 'Handlinger',
      createNewUser: 'Opret Ny Bruger',
      editUser: 'Rediger Bruger',
      userDetails: 'Brugerdetaljer',
      fullName: 'Fulde Navn',
      email: 'E-mail',
      phone: 'Telefon',
      notes: 'Noter',
      additionalNotes: 'Yderligere noter om denne bruger...',
      saveChanges: 'Gem Ændringer',
      createUser: 'Opret Bruger',
      cancel: 'Annuller',
      deleteUser: 'Slet Bruger',
      confirmDelete: 'Er du sikker på, at du vil slette denne bruger?',
      never: 'Aldrig',
      accessDenied: 'Adgang Nægtet',
      noPermission: 'Du har ikke tilladelse til at få adgang til denne side.'
    }
  }
}
