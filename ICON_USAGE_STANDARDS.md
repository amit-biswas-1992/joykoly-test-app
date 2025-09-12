# Icon Usage Standards for Joykoly Test App

## 🚨 CRITICAL: Icon Library Standards

### ✅ APPROVED Icon Libraries
- **@expo/vector-icons** - PRIMARY library for all icons
  - `Ionicons` - Most comprehensive and modern icons
  - `MaterialIcons` - Material Design icons
  - `AntDesign` - Ant Design icons
  - `Feather` - Minimalist icons

### ❌ FORBIDDEN Icon Libraries
- **lucide-react-native** - DO NOT USE
- **react-native-vector-icons** - DO NOT USE
- Any other icon libraries not listed above

## 📋 Icon Usage Rules

### 1. Import Statement
```tsx
// ✅ CORRECT
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';

// ❌ WRONG
import { Settings, Edit3, BookOpen } from 'lucide-react-native';
```

### 2. Icon Usage Patterns

#### Settings/Configuration Icons
```tsx
// ✅ CORRECT
<Ionicons name="settings-outline" size={20} color="#6B7280" />

// ❌ WRONG
<Settings size={20} color="#6B7280" />
```

#### Edit/Modify Icons
```tsx
// ✅ CORRECT
<Feather name="edit-3" size={16} color="#6B7280" />
<Ionicons name="create-outline" size={16} color="#6B7280" />

// ❌ WRONG
<Edit3 size={16} color="#6B7280" />
```

#### Add/Create Icons
```tsx
// ✅ CORRECT
<Ionicons name="add" size={16} color="white" />
<MaterialIcons name="add" size={16} color="white" />

// ❌ WRONG
<Plus size={16} color="white" />
```

#### Book/Education Icons
```tsx
// ✅ CORRECT
<Ionicons name="book-outline" size={20} color="#10B981" />
<Ionicons name="school-outline" size={20} color="#3B82F6" />

// ❌ WRONG
<BookOpen size={20} color="#10B981" />
<GraduationCap size={20} color="#3B82F6" />
```

#### Achievement/Trophy Icons
```tsx
// ✅ CORRECT
<Ionicons name="trophy-outline" size={20} color="#F59E0B" />
<Ionicons name="medal-outline" size={20} color="#F59E0B" />

// ❌ WRONG
<Award size={20} color="#F59E0B" />
<Trophy size={20} color="#F59E0B" />
```

#### Shopping/Bag Icons
```tsx
// ✅ CORRECT
<Ionicons name="bag-outline" size={20} color="#EF4444" />
<Ionicons name="storefront-outline" size={20} color="#EF4444" />

// ❌ WRONG
<ShoppingBag size={20} color="#EF4444" />
```

#### Target/Goal Icons
```tsx
// ✅ CORRECT
<MaterialIcons name="flag" size={20} color="#8B5CF6" />
<Ionicons name="target" size={20} color="#8B5CF6" />

// ❌ WRONG
<Target size={20} color="#8B5CF6" />
```

## 🎯 Icon Selection Guidelines

### Priority Order for Icon Selection:
1. **Ionicons** - First choice (most comprehensive, modern design)
2. **MaterialIcons** - Second choice (Material Design consistency)
3. **AntDesign** - Third choice (specific use cases)
4. **Feather** - Fourth choice (minimalist design)

### Common Icon Mappings:
| Lucide Icon | React Native Equivalent |
|-------------|------------------------|
| `Settings` | `Ionicons: "settings-outline"` |
| `Edit3` | `Feather: "edit-3"` or `Ionicons: "create-outline"` |
| `BookOpen` | `Ionicons: "book-outline"` |
| `Target` | `MaterialIcons: "flag"` or `Ionicons: "target"` |
| `Trophy` | `Ionicons: "trophy-outline"` |
| `Award` | `Ionicons: "medal-outline"` |
| `GraduationCap` | `Ionicons: "school-outline"` |
| `ShoppingBag` | `Ionicons: "bag-outline"` |
| `Plus` | `Ionicons: "add"` |
| `X` | `Ionicons: "close"` |

## 🔧 Implementation Checklist

Before implementing any icon:
- [ ] Check if `@expo/vector-icons` is already imported
- [ ] Use appropriate icon family (Ionicons preferred)
- [ ] Match the semantic meaning with the icon name
- [ ] Use consistent sizing (16, 20, 24px are common)
- [ ] Use consistent colors from the design system
- [ ] Test on both iOS and Android

## 🚫 Common Mistakes to Avoid

1. **Mixing icon libraries** - Never import from multiple icon libraries
2. **Using external icon packages** - Stick to @expo/vector-icons only
3. **Inconsistent naming** - Use outline variants for consistency
4. **Wrong import paths** - Always import from '@expo/vector-icons'
5. **Missing size/color props** - Always specify size and color

## 📱 Platform Considerations

- **Ionicons** work consistently across iOS and Android
- **MaterialIcons** may have slight visual differences on iOS
- **AntDesign** and **Feather** are generally platform-agnostic
- Always test icons on both platforms before deployment

---

**Remember**: Consistency in icon usage improves user experience and maintains design system integrity. When in doubt, use Ionicons with outline variants.
