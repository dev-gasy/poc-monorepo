export interface WorkspaceOption<TValue extends string> {
  readonly label: string;
  readonly value: TValue;
}

export interface WorkspaceHeaderProps<TBrand extends string, TLanguage extends string> {
  readonly appName: string;
  readonly brand: TBrand;
  readonly brands: readonly WorkspaceOption<TBrand>[];
  readonly language: TLanguage;
  readonly languages: readonly WorkspaceOption<TLanguage>[];
  readonly onBrandChange: (brand: TBrand) => void;
  readonly onLanguageChange: (language: TLanguage) => void;
}

export function WorkspaceHeader<TBrand extends string, TLanguage extends string>({
  appName,
  brand,
  brands,
  language,
  languages,
  onBrandChange,
  onLanguageChange,
}: WorkspaceHeaderProps<TBrand, TLanguage>) {
  return (
    <header className="workspace-header">
      <a className="workspace-wordmark" href="/">
        {appName}
      </a>

      <div className="workspace-switches">
        <div className="workspace-switch-group" aria-label="Brand">
          <span>Brand</span>
          <div>
            {brands.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={option.value === brand}
                onClick={() => onBrandChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="workspace-switch-group" aria-label="Language">
          <span>Lang</span>
          <div>
            {languages.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={option.value === language}
                onClick={() => onLanguageChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
