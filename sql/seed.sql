-- Seed data matching the catalog already built for the front end.
-- Run after schema.sql. Safe to re-run against an empty perfumes table.

INSERT INTO perfumes (name, family, top_notes, heart_notes, base_notes, size, price_cents) VALUES
('Pivoine Nue',        'Floral',   'pink pepper, bergamot',      'peony, jasmine',            'white musk, cedar',      '50ml',  21000),
('Voile de Tubéreuse', 'Floral',   'mandarin, green leaves',     'tuberose, ylang-ylang',     'sandalwood, vanilla',    '100ml', 26500),
('Iris Silence',       'Floral',   'violet leaf',                'iris, orris root',          'suede, ambergris',       '50ml',  24000),

('Cèdre Nocturne',     'Woody',    'cardamom, black pepper',     'cedarwood, vetiver',        'oud, leather',           '100ml', 29500),
('Racine',             'Woody',    'bergamot, fig leaf',         'guaiac wood, cypress',      'patchouli, oakmoss',     '50ml',  20500),
('Santal Brut',        'Woody',    'pink grapefruit',            'sandalwood, iris',          'tonka bean, musk',       '100ml', 25500),

('Ambre Doré',         'Oriental', 'saffron, orange blossom',    'labdanum, benzoin',         'amber, vanilla',         '50ml',  23000),
('Nuit d''Encens',     'Oriental', 'pink pepper, elemi',         'frankincense, rose',        'styrax, dark musk',      '100ml', 28000),
('Épices Rares',       'Oriental', 'cinnamon, cardamom',         'clove, immortelle',         'amber, leather',         '50ml',  22500),

('Zeste Éclat',        'Citrus',   'bergamot, lemon',            'petitgrain, neroli',        'white cedar, musk',      '100ml', 17500),
('Bigarade Fraîche',   'Citrus',   'bitter orange, mandarin',    'orange blossom',            'vetiver, musk',          '50ml',  16000),
('Citron Vert',        'Citrus',   'lime, grapefruit',           'basil, mint',               'light musk, cedar',      '100ml', 17000),

('Sel Marin',          'Fresh',    'sea salt, bergamot',         'lily of the valley',        'driftwood, ambergris',   '100ml', 19500),
('Brume Blanche',      'Fresh',    'aldehydes, mandarin',        'white tea, jasmine',        'musk, cedar',            '50ml',  18500),
('Vent du Nord',       'Fresh',    'eucalyptus, mint',           'sage, lavender',            'vetiver, moss',          '100ml', 19000),

('Fève Tonka',         'Gourmand', 'bergamot, almond',           'praline, orchid',           'tonka bean, vanilla',    '50ml',  22000),
('Miel Sauvage',       'Gourmand', 'mandarin, pear',             'honey, jasmine',            'amber, benzoin',         '100ml', 25000),
('Cacao Noir',         'Gourmand', 'bergamot, coffee',           'cacao, rose',               'vanilla, patchouli',     '50ml',  23500),

('Lavande Grise',      'Aromatic', 'lavender, bergamot',         'sage, geranium',            'oakmoss, tonka',         '100ml', 20000),
('Mousse et Feu',      'Aromatic', 'bergamot, pink pepper',      'labdanum, patchouli',       'oakmoss, leather',       '50ml',  21500),
('Herbe Sèche',        'Aromatic', 'thyme, bergamot',            'rosemary, clary sage',      'vetiver, amber',         '100ml', 19500);
