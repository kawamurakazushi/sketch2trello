const pluginIdentifier = 'com.kawamurakazushi.sketch2trello';

export const getPreferences = key => {
  const userDefaults = NSUserDefaults.standardUserDefaults();

  if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
    const defaultPrefs = NSMutableDictionary.alloc().init();
    userDefaults.setObject_forKey(defaultPrefs, pluginIdentifier);
    userDefaults.synchronize();
  }
  return userDefaults.dictionaryForKey(pluginIdentifier).objectForKey(key);
};

export const setPreferences = (key, value) => {
  const userDefaults = NSUserDefaults.standardUserDefaults();

  let prefs;
  if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
    prefs = NSMutableDictionary.alloc().init();
  } else {
    prefs = NSMutableDictionary.dictionaryWithDictionary(
      userDefaults.dictionaryForKey(pluginIdentifier),
    );
  }
  prefs.setObject_forKey(value, key);
  userDefaults.setObject_forKey(prefs, pluginIdentifier);
  userDefaults.synchronize();
};

export const removeKey = key => {
  const userDefaults = NSUserDefaults.standardUserDefaults();

  if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
    const prefs = NSMutableDictionary.alloc().init();
  } else {
    const prefs = NSMutableDictionary.dictionaryWithDictionary(
      userDefaults.dictionaryForKey(pluginIdentifier),
    );
  }
  prefs.removeObjectForKey(key);
  userDefaults.setObject_forKey(prefs, pluginIdentifier);
  userDefaults.synchronize();
};
