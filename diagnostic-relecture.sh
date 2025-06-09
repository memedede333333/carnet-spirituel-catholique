#!/bin/bash
echo "=== DIAGNOSTIC COMPLET ==="
echo ""
echo "1. Vérifier si le fichier existe:"
ls -la "app/(app)/relecture/page.tsx"
echo ""
echo "2. Nombre de lignes:"
wc -l "app/(app)/relecture/page.tsx"
echo ""
echo "3. Début du fichier (20 premières lignes):"
head -20 "app/(app)/relecture/page.tsx"
echo ""
echo "4. Fin du fichier (20 dernières lignes):"
tail -20 "app/(app)/relecture/page.tsx"
echo ""
echo "5. Recherche hoveredEntry:"
grep -n "hoveredEntry" "app/(app)/relecture/page.tsx" | head -5
echo ""
echo "6. Recherche areEntriesLinked:"
grep -n "areEntriesLinked" "app/(app)/relecture/page.tsx" | head -5
echo ""
echo "7. Recherche constellation:"
grep -n "constellation" "app/(app)/relecture/page.tsx" | head -5
echo ""
echo "8. Recherche ConstellationView:"
grep -n "ConstellationView" "app/(app)/relecture/page.tsx" | head -5
echo ""
echo "9. Vérifier si ConstellationView.tsx existe:"
ls -la "app/components/ConstellationView.tsx" 2>/dev/null || echo "ConstellationView.tsx n'existe pas"
echo ""
echo "10. Recherche d'erreurs de syntaxe (accolades non fermées):"
grep -n "{{" "app/(app)/relecture/page.tsx" | head -5
